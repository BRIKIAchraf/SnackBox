import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PaymentStateService {
  private readonly logger = new Logger(PaymentStateService.name);

  constructor(private readonly prisma: PrismaService) {}

  async handlePaymentSuccess(orderId: string) {
    this.logger.log(`Handling payment success for order: ${orderId}`);
    
    return this.prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({ where: { id: orderId } });
      
      if (!order) throw new Error('Order not found');
      
      return tx.order.update({
        where: { id: orderId },
        data: {
          paymentStatus: 'PAID',
          status: 'CONFIRMED',
        },
      });
    });
  }

  async handlePaymentFailure(orderId: string) {
    this.logger.warn(`Handling payment failure for order: ${orderId}`);
    
    return this.prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: 'FAILED',
      },
    });
  }
}
