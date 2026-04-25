import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationsGateway } from '../notifications/notifications.gateway';
import { CreateDeliveryZoneDto } from './dto/create-delivery-zone.dto';
import { UpdateDeliveryZoneDto } from './dto/update-delivery-zone.dto';
import { DeliveryZoneType } from '@prisma/client';

@Injectable()
export class DeliveryZonesService {
  private readonly logger = new Logger(DeliveryZonesService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsGateway: NotificationsGateway
  ) {}

  async findAll() {
    return this.prisma.deliveryZone.findMany();
  }

  async create(data: CreateDeliveryZoneDto) {
    try {
      const zone = await this.prisma.deliveryZone.create({ data });
      this.notifyUpdate();
      return zone;
    } catch (error) {
      this.logger.error(`Error creating delivery zone: ${error.message}`);
      throw new BadRequestException('Could not create delivery zone');
    }
  }

  async update(id: string, data: UpdateDeliveryZoneDto) {
    try {
      const zone = await this.prisma.deliveryZone.update({
        where: { id },
        data,
      });
      this.notifyUpdate();
      return zone;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Delivery zone with ID ${id} not found`);
      }
      this.logger.error(`Error updating delivery zone ${id}: ${error.message}`);
      throw new BadRequestException('Could not update delivery zone');
    }
  }

  async remove(id: string) {
    try {
      const zone = await this.prisma.deliveryZone.delete({ where: { id } });
      this.notifyUpdate();
      return zone;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Delivery zone with ID ${id} not found`);
      }
      this.logger.error(`Error deleting delivery zone ${id}: ${error.message}`);
      throw new BadRequestException('Could not delete delivery zone');
    }
  }

  async validateLocation(lat: number, lng: number, zipCode?: string) {
    const zones = await this.prisma.deliveryZone.findMany({
      where: { isActive: true }
    });

    for (const zone of zones) {
      if (zone.type === DeliveryZoneType.RADIUS && zone.radius && zone.centerLat && zone.centerLng) {
        const distance = this.getDistance(lat, lng, zone.centerLat, zone.centerLng);
        if (distance <= zone.radius) return zone;
      }

      if (zone.type === DeliveryZoneType.ZIP_CODES && zone.zipCodes && zipCode) {
        const allowedZips = zone.zipCodes.split(',').map((zip: string) => zip.trim());
        if (allowedZips.includes(zipCode)) return zone;
      }

      if (zone.type === DeliveryZoneType.POLYGON && zone.polygon) {
        try {
          const polygonCoords = JSON.parse(zone.polygon);
          if (Array.isArray(polygonCoords) && this.isPointInPolygon({ lat, lng }, polygonCoords)) {
            return zone;
          }
        } catch (e) {
          this.logger.warn(`Invalid polygon data for zone ${zone.id}`);
        }
      }
    }

    return null;
  }

  private async notifyUpdate() {
    try {
      await this.notificationsGateway.notifyZoneUpdate();
    } catch (error) {
      this.logger.warn(`Failed to notify zone update: ${error.message}`);
    }
  }

  // Haversine formula for distance in KM
  private getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371; // Radius of the earth in km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private deg2rad(deg: number) {
    return deg * (Math.PI / 180);
  }

  // Ray-casting algorithm
  private isPointInPolygon(point: { lat: number, lng: number }, polygon: { lat: number, lng: number }[]) {
    let isInside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i].lat, yi = polygon[i].lng;
      const xj = polygon[j].lat, yj = polygon[j].lng;

      const intersect = ((yi > point.lng) !== (yj > point.lng))
        && (point.lat < (xj - xi) * (point.lng - yi) / (yj - yi) + xi);
      if (intersect) isInside = !isInside;
    }
    return isInside;
  }
}

