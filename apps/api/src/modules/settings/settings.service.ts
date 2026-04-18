import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationsGateway } from '../notifications/notifications.gateway';

@Injectable()
export class SettingsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsGateway: NotificationsGateway
  ) {}

  async getSettings() {
    return this.prisma.settings.upsert({
      where: { id: 'global' },
      update: {},
      create: { id: 'global' },
    });
  }

  async updateSettings(data: any) {
    const settings = await this.prisma.settings.update({
      where: { id: 'global' },
      data,
    });
    this.notificationsGateway.notifyMenuUpdate(); // Use menu_updated as a generic refresh trigger
    return settings;
  }
}
