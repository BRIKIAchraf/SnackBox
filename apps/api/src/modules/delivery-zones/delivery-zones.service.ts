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

  async validateLocation(lat: number, lng: number, zipCode?: string) {
    const zones = await this.prisma.deliveryZone.findMany({
      where: { isActive: true }
    });

    for (const zone of zones) {
      const z = zone as any;

      if (z.type === 'RADIUS' && z.radius && z.centerLat && z.centerLng) {
        const distance = this.getDistance(lat, lng, z.centerLat, z.centerLng);
        if (distance <= z.radius) return zone;
      }

      if (z.type === 'ZIP_CODES' && z.zipCodes && zipCode) {
        const allowedZips = z.zipCodes.split(',').map((zip: string) => zip.trim());
        if (allowedZips.includes(zipCode)) return zone;
      }

      if (z.type === 'POLYGON' && z.polygon) {
        try {
          const polygonCoords = JSON.parse(z.polygon);
          if (this.isPointInPolygon({ lat, lng }, polygonCoords)) return zone;
        } catch (e) {
          console.error("Invalid polygon data for zone", zone.id);
        }
      }
    }

    return null;
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
