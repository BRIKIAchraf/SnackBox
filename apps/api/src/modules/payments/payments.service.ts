import { Injectable, Logger } from '@nestjs/common';
import Stripe from 'stripe';
import { PrismaService } from '../../prisma/prisma.service';
import { PaymentStatus, PaymentProvider } from '@prisma/client';

@Injectable()
export class PaymentsService {
  private stripe: any;
  private readonly logger = new Logger(PaymentsService.name);

  constructor(private readonly prisma: PrismaService) {
    const stripeKey = process.env.STRIPE_SECRET_KEY || 'sk_test_dummyKeyToAvoidCrashOnStartup';
    this.stripe = new Stripe(stripeKey, {
      apiVersion: '2025-01-27' as any,
    });
  }

  async createCheckoutSession(orderId: string, successUrl: string, cancelUrl: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true, offers: true },
    });

    if (!order) throw new Error('Order not found');

    const lineItems = order.items.map((item) => ({
      price_data: {
        currency: 'eur',
        product_data: {
          name: item.name,
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    // Add Offers (Packs)
    order.offers.forEach((offer) => {
        lineItems.push({
            price_data: {
                currency: 'eur',
                product_data: {
                    name: `Pack: ${offer.name}`,
                    description: (() => {
                        try {
                            const parsed = offer.options ? JSON.parse(offer.options) : null;
                            if (Array.isArray(parsed)) return parsed.join(', ');
                            if (parsed?.selections) return parsed.selections.map((s: any) => s.name).join(', ');
                            return '';
                        } catch { return ''; }
                    })()
                } as any,
                unit_amount: Math.round(offer.price * 100),
            },
            quantity: offer.quantity,
        });
    });

    // Add delivery fee as a line item if applicable
    const deliveryZone = await this.prisma.deliveryZone.findUnique({
        where: { id: order.deliveryZoneId || '' }
    });
    
    if (deliveryZone && deliveryZone.fee > 0) {
        lineItems.push({
            price_data: {
                currency: 'eur',
                product_data: {
                    name: `Frais de livraison (${deliveryZone.name})`,
                },
                unit_amount: Math.round(deliveryZone.fee * 100),
            },
            quantity: 1,
        });
    }

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      payment_intent_data: {
        capture_method: 'manual',
        metadata: {
          orderId: order.id,
        },
      },
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        orderId: order.id,
      },
    }, {
      idempotencyKey: `checkout_${order.id}`
    });

    return { url: session.url };
  }

  async capturePayment(paymentIntentId: string) {
    try {
        const intent = await this.stripe.paymentIntents.capture(paymentIntentId);
        this.logger.log(`Payment captured: ${intent.id}`);
        return intent;
    } catch (e) {
        this.logger.error(`Failed to capture payment: ${e.message}`);
        throw e;
    }
  }

  async cancelPayment(paymentIntentId: string) {
    try {
        const intent = await this.stripe.paymentIntents.cancel(paymentIntentId);
        this.logger.log(`Payment cancelled/voided: ${intent.id}`);
        return intent;
    } catch (e) {
        this.logger.error(`Failed to cancel payment: ${e.message}`);
        throw e;
    }
  }
}

