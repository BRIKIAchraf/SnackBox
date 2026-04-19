import { Controller, Post, Headers, Req, RawBodyRequest, Logger, BadRequestException } from '@nestjs/common';
import { PaymentStateService } from './payment-state.service';
import { Request } from 'express';
import Stripe from 'stripe';

@Controller('payments/webhooks')
export class WebhooksController {
  private readonly stripe: any;
  private readonly logger = new Logger(WebhooksController.name);

  constructor(private readonly paymentState: PaymentStateService) {
      this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
          apiVersion: '2025-01-27' as any,
      });
  }

  @Post('stripe')
  async handleStripe(@Headers('stripe-signature') signature: string, @Req() request: RawBodyRequest<Request>) {
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
    let event: any;

    try {
      if (endpointSecret && signature) {
        event = this.stripe.webhooks.constructEvent(
          request.rawBody,
          signature,
          endpointSecret
        );
      } else {
        event = request.body; // Fallback for testing without signature if secret is not set
      }
    } catch (err) {
      this.logger.error(`Webhook signature verification failed: ${err.message}`);
      throw new BadRequestException(`Webhook Error: ${err.message}`);
    }

    const paymentIntent = event.data.object as any;
    const orderId = paymentIntent.metadata?.orderId;

    if (!orderId) {
        this.logger.warn(`Webhook received for event ${event.type} but no orderId found in metadata`);
        return { received: true };
    }

    switch (event.type) {
      case 'payment_intent.amount_capturable_updated':
        // Money is authorized but not yet captured
        await this.paymentState.handlePaymentAuthorized(orderId, paymentIntent.id);
        break;

      case 'payment_intent.succeeded':
        // Money is captured
        await this.paymentState.handlePaymentSuccess(orderId);
        break;

      case 'payment_intent.payment_failed':
        await this.paymentState.handlePaymentFailure(orderId);
        break;

      case 'payment_intent.canceled':
        await this.paymentState.handlePaymentCancelled(orderId);
        break;

      default:
        this.logger.log(`Unhandled event type: ${event.type}`);
    }

    return { received: true };
  }
}
