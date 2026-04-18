import { Injectable, Inject } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationsGateway } from '../notifications/notifications.gateway';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class ProductsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsGateway: NotificationsGateway,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  async findAll() {
    return this.prisma.product.findMany({
      where: { isDeleted: false },
      include: { category: true },
    });
  }

  async findOne(id: string) {
    return this.prisma.product.findFirst({
      where: { id, isDeleted: false },
      include: { category: true },
    });
  }

  async create(data: any, userId?: string) {
    const product = await this.prisma.product.create({ data });
    
    await this.prisma.auditLog.create({
        data: {
            action: 'CREATE_PRODUCT',
            entity: 'PRODUCT',
            entityId: product.id,
            userId,
            details: JSON.stringify({ name: product.name })
        }
    });

    await this.cacheManager.del('menu:products');
    this.notificationsGateway.notifyMenuUpdate();
    return product;
  }

  async updateAvailability(id: string, available: boolean) {
    const product = await this.prisma.product.update({
      where: { id },
      data: { available }
    });
    await this.cacheManager.del('menu:products');
    this.notificationsGateway.notifyMenuUpdate();
    return product;
  }

  async softDelete(id: string) {
    const product = await this.prisma.product.update({
      where: { id },
      data: { isDeleted: true }
    });
    await this.cacheManager.del('menu:products');
    this.notificationsGateway.notifyMenuUpdate();
    return product;
  }

  async update(id: string, data: any, userId?: string) {
    const product = await this.prisma.product.update({
      where: { id },
      data
    });

    await this.prisma.auditLog.create({
        data: {
            action: 'UPDATE_PRODUCT',
            entity: 'PRODUCT',
            entityId: id,
            userId,
            details: JSON.stringify(data)
        }
    });

    await this.cacheManager.del('menu:products');
    this.notificationsGateway.notifyMenuUpdate();
    return product;
  }

  // Toppings
  async findAllToppings() {
    return this.prisma.topping.findMany({
      where: { available: true }
    });
  }
}
