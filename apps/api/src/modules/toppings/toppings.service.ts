import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationsGateway } from '../notifications/notifications.gateway';

@Injectable()
export class ToppingsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsGateway: NotificationsGateway
  ) {}

  async findAll() {
    return this.prisma.topping.findMany({
      where: { available: true }
    });
  }

  async create(data: any) {
    const topping = await this.prisma.topping.create({ data });
    this.notificationsGateway.notifyMenuUpdate(); // Toppings are part of menu sync
    return topping;
  }

  async update(id: string, data: any) {
    const topping = await this.prisma.topping.update({
      where: { id },
      data,
    });
    this.notificationsGateway.notifyMenuUpdate();
    return topping;
  }

  async remove(id: string) {
    const topping = await this.prisma.topping.delete({ where: { id } });
    this.notificationsGateway.notifyMenuUpdate();
    return topping;
  }
}
