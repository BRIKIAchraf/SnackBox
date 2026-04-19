import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PaymentStateService {
  private readonly logger = new Logger(PaymentStateService.name);

  constructor(private readonly prisma: PrismaService) {}

  async handlePaymentAuthorized(orderId: string, paymentIntentId: string) {
    this.logger.log(`Handling payment authorized for order: ${orderId}`);
    
    return this.prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: 'AUTHORIZED',
        status: 'PENDING_ADMIN_VALIDATION',
        paymentIntentId,
      } as any,
    });
  }

  async handlePaymentSuccess(orderId: string) {
    this.logger.log(`Handling payment success for order: ${orderId}`);
    
    return this.prisma.order.update({
        where: { id: orderId },
        data: {
          paymentStatus: 'PAID',
          status: 'CONFIRMED',
        },
    });
  }

  async handlePaymentFailure(orderId: string) {
    this.logger.warn(`Handling payment failure for order: ${orderId}`);
    
    return this.prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: 'FAILED',
        status: 'CANCELLED',
      },
    });
  }

  async handlePaymentCancelled(orderId: string) {
    this.logger.log(`Handling payment cancelled for order: ${orderId}`);
    
    return this.prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: 'CANCELLED',
        status: 'CANCELLED',
      },
    });
  }
}
