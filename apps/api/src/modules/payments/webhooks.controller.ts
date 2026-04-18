import { Controller, Post, Body, Headers, Req, RawBodyRequest } from '@nestjs/common';
import { PaymentStateService } from './payment-state.service';
import { Request } from 'express';

@Controller('payments/webhooks')
export class WebhooksController {
  constructor(private readonly paymentState: PaymentStateService) {}

  @Post('stripe')
  async handleStripe(@Headers('stripe-signature') signature: string, @Req() request: RawBodyRequest<Request>) {
    // In real implementation: verify signature with Stripe SDK
    const event = request.body; // Mocked event for now
    
    if (event.type === 'payment_intent.succeeded') {
      const orderId = event.data.object.metadata.orderId;
      await this.paymentState.handlePaymentSuccess(orderId);
    }

    return { received: true };
  }
}
