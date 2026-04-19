import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { DeliveryZonesService } from './delivery-zones.service';

@Controller('delivery-zones')
export class DeliveryZonesController {
  constructor(private readonly zonesService: DeliveryZonesService) {}

  @Get()
  findAll() {
    return this.zonesService.findAll();
  }

  @Post()
  create(@Body() data: any) {
    return this.zonesService.create(data);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.zonesService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.zonesService.remove(id);
  }

  @Post('validate')
  validate(@Body() body: { lat: number; lng: number; zipCode?: string }) {
    return this.zonesService.validateLocation(body.lat, body.lng, body.zipCode);
  }
}
