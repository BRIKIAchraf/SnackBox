import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create-session')
  createSession(@Body() body: { orderId: string, successUrl: string, cancelUrl: string }) {
    return this.paymentsService.createCheckoutSession(body.orderId, body.successUrl, body.cancelUrl);
  }
}
