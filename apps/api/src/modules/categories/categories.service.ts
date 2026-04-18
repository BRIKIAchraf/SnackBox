import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationsGateway } from '../notifications/notifications.gateway';

@Injectable()
export class CategoriesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsGateway: NotificationsGateway
  ) {}

  async findAll() {
    return this.prisma.category.findMany({
      where: { isDeleted: false },
      include: { products: { where: { isDeleted: false } } }
    });
  }

  async create(data: any) {
    const category = await this.prisma.category.create({ data });
    this.notificationsGateway.notifyCategoryUpdate();
    return category;
  }

  async delete(id: string) {
    const productsCount = await this.prisma.product.count({
      where: { categoryId: id, isDeleted: false }
    });

    if (productsCount > 0) {
      throw new Error('Cannot delete category with active products');
    }

    const category = await this.prisma.category.update({
      where: { id },
      data: { isDeleted: true }
    });
    this.notificationsGateway.notifyCategoryUpdate();
    return category;
  }
}
