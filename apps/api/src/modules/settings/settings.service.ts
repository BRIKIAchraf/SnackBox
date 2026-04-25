import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationsGateway } from '../notifications/notifications.gateway';
import { UpdateSettingsDto } from './dto/update-settings.dto';

@Injectable()
export class SettingsService {
  private readonly logger = new Logger(SettingsService.name);

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

  async updateSettings(data: UpdateSettingsDto) {
    try {
      const settings = await this.prisma.settings.update({
        where: { id: 'global' },
        data,
      });
      this.notificationsGateway.notifyMenuUpdate();
      return settings;
    } catch (error) {
      this.logger.error(`Error updating settings: ${error.message}`);
      throw new BadRequestException('Could not update settings');
    }
  }
}

