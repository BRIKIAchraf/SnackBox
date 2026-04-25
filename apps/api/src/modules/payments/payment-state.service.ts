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



