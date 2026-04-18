import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationsGateway } from '../notifications/notifications.gateway';

@Injectable()
export class OffersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsGateway: NotificationsGateway
  ) {}

  async findAll() {
    return this.prisma.offer.findMany({
      where: { isDeleted: false },
    });
  }

  async findOne(id: string) {
    return this.prisma.offer.findFirst({
      where: { id, isDeleted: false },
    });
  }

  async create(data: any, userId?: string) {
    const offer = await this.prisma.offer.create({ data });
    
    await this.prisma.auditLog.create({
        data: {
            action: 'CREATE_OFFER',
            entity: 'OFFER',
            entityId: offer.id,
            userId,
            details: JSON.stringify({ name: offer.name })
        }
    });

    this.notificationsGateway.notifyMenuUpdate(); // Reusing the same signal since menu page will reload
    return offer;
  }

  async updateAvailability(id: string, available: boolean) {
    const offer = await this.prisma.offer.update({
      where: { id },
      data: { available }
    });
    this.notificationsGateway.notifyMenuUpdate();
    return offer;
  }

  async update(id: string, data: any, userId?: string) {
    const offer = await this.prisma.offer.update({
      where: { id },
      data
    });

    await this.prisma.auditLog.create({
        data: {
            action: 'UPDATE_OFFER',
            entity: 'OFFER',
            entityId: id,
            userId,
            details: JSON.stringify(data)
        }
    });

    this.notificationsGateway.notifyMenuUpdate();
    return offer;
  }

  async softDelete(id: string) {
    const offer = await this.prisma.offer.update({
      where: { id },
      data: { isDeleted: true }
    });
    this.notificationsGateway.notifyMenuUpdate();
    return offer;
  }
}
