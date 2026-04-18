import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  async getCart(userId: string) {
    return this.prisma.cart.findUnique({
      where: { userId },
      include: { items: { include: { product: true } } },
    });
  }

  async updateCart(userId: string, items: { productId: string; quantity: number }[]) {
    // Upsert cart
    const cart = await this.prisma.cart.upsert({
      where: { userId },
      create: { userId },
      update: { updatedAt: new Date() },
    });

    // Replace items
    await this.prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    
    return this.prisma.cart.update({
      where: { id: cart.id },
      data: {
        items: {
          create: items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        },
      },
      include: { items: true },
    });
  }
}
