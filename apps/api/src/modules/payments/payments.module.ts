import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { PaymentStateService } from './payment-state.service';
import { WebhooksController } from './webhooks.controller';

@Module({
  controllers: [PaymentsController, WebhooksController],
  providers: [PaymentsService, PaymentStateService],
  exports: [PaymentsService],
})
export class PaymentsModule {}
