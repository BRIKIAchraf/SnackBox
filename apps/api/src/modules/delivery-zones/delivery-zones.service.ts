import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationsGateway } from '../notifications/notifications.gateway';

@Injectable()
export class DeliveryZonesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsGateway: NotificationsGateway
  ) {}

  async findAll() {
    return this.prisma.deliveryZone.findMany();
  }

  async create(data: any) {
    const zone = await this.prisma.deliveryZone.create({ data });
    this.notificationsGateway.notifyZoneUpdate();
    return zone;
  }

  async update(id: string, data: any) {
    const zone = await this.prisma.deliveryZone.update({
      where: { id },
      data,
    });
    this.notificationsGateway.notifyZoneUpdate();
    return zone;
  }

  async remove(id: string) {
    const zone = await this.prisma.deliveryZone.delete({ where: { id } });
    this.notificationsGateway.notifyZoneUpdate();
    return zone;
  }
}
