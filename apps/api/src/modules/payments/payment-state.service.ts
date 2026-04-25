import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { OrderStatus, PaymentStatus } from '@prisma/client';

@Injectable()
export class PaymentStateService {
  private readonly logger = new Logger(PaymentStateService.name);

  constructor(private readonly prisma: PrismaService) {}

  async handlePaymentAuthorized(orderId: string, paymentIntentId: string) {
    this.logger.log(`Handling payment authorized for order: ${orderId}`);
    
    return this.prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: PaymentStatus.AUTHORIZED,
        status: OrderStatus.PENDING_ADMIN_VALIDATION,
        paymentIntentId,
      },
    });
  }

  async handlePaymentSuccess(orderId: string) {
    this.logger.log(`Handling payment success for order: ${orderId}`);
    
    return this.prisma.order.update({
        where: { id: orderId },
        data: {
          paymentStatus: PaymentStatus.PAID,
          status: OrderStatus.CONFIRMED,
        },
    });
  }

  async handlePaymentFailure(orderId: string) {
    this.logger.warn(`Handling payment failure for order: ${orderId}`);
    
    return this.prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: PaymentStatus.FAILED,
        status: OrderStatus.CANCELLED,
      },
    });
  }

  async handlePaymentCancelled(orderId: string) {
    this.logger.log(`Handling payment cancelled for order: ${orderId}`);
    
    return this.prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: PaymentStatus.CANCELLED,
        status: OrderStatus.CANCELLED,
      },
    });
  }
}

