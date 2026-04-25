import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { OrderStatus, PaymentStatus } from '@prisma/client';
import { NotificationsGateway } from '../notifications/notifications.gateway';

@Injectable()
export class PaymentStateService {
  private readonly logger = new Logger(PaymentStateService.name);

  constructor(
      private readonly prisma: PrismaService,
      private readonly notificationsGateway: NotificationsGateway
  ) {}

  async handlePaymentAuthorized(orderId: string, paymentIntentId: string) {
    const currentOrder = await this.prisma.order.findUnique({ where: { id: orderId } });
    
    // Skip if already paid or authorized (idempotency)
    if (currentOrder?.paymentStatus === PaymentStatus.PAID || 
        currentOrder?.paymentStatus === PaymentStatus.AUTHORIZED) {
      this.logger.log(`Payment for order ${orderId} already handled. Skipping.`);
      return currentOrder;
    }

    this.logger.log(`Handling payment authorized for order: ${orderId}`);
    
    const order = await this.prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: PaymentStatus.AUTHORIZED,
        status: OrderStatus.PENDING_ADMIN_VALIDATION,
        paymentIntentId,
      },
    });

    this.notificationsGateway.notifyStatusUpdate(orderId, order.status);
    return order;
  }

  async handlePaymentSuccess(orderId: string) {
    const currentOrder = await this.prisma.order.findUnique({ where: { id: orderId } });

    // Skip if already paid (idempotency)
    if (currentOrder?.paymentStatus === PaymentStatus.PAID) {
      this.logger.log(`Order ${orderId} already marked as PAID. Skipping.`);
      return currentOrder;
    }

    // Do NOT reactivate a cancelled order via a delayed webhook
    if (currentOrder?.status === OrderStatus.CANCELLED) {
      this.logger.warn(`Received payment for CANCELLED order ${orderId}. Keeping CANCELLED status.`);
      return currentOrder;
    }

    this.logger.log(`Handling payment success for order: ${orderId}`);
    
    const order = await this.prisma.order.update({
        where: { id: orderId },
        data: {
          paymentStatus: PaymentStatus.PAID,
          status: OrderStatus.CONFIRMED,
        },
    });

    this.notificationsGateway.notifyStatusUpdate(orderId, order.status);
    return order;
  }

  async handlePaymentFailure(orderId: string) {
    this.logger.warn(`Handling payment failure for order: ${orderId}`);
    
    const order = await this.prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: PaymentStatus.FAILED,
        status: OrderStatus.CANCELLED,
      },
    });

    this.notificationsGateway.notifyStatusUpdate(orderId, order.status);
    return order;
  }

  async handlePaymentCancelled(orderId: string) {
    this.logger.log(`Handling payment cancelled for order: ${orderId}`);
    
    const order = await this.prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: PaymentStatus.CANCELLED,
        status: OrderStatus.CANCELLED,
      },
    });

    this.notificationsGateway.notifyStatusUpdate(orderId, order.status);
    return order;
  }
}



