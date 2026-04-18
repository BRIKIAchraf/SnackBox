import { Injectable, Logger } from '@nestjs/common';
import Stripe from 'stripe';
import { PrismaService } from '../../prisma/prisma.service';

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
      include: { items: true },
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

    // Add delivery fee as a line item if applicable
    const deliveryZone = await this.prisma.deliveryZone.findUnique({
        where: { id: order.deliveryZoneId || '' }
    });
    
    if (deliveryZone && deliveryZone.fee > 0) {
        lineItems.push({
            price_data: {
                currency: 'eur',
                product_data: {
                    name: `Livraison (${deliveryZone.name})`,
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
      success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl,
      metadata: {
        orderId: order.id,
      },
    }, {
      idempotencyKey: `${order.id}-payment-intent`
    });

    return { url: session.url };
  }
}
