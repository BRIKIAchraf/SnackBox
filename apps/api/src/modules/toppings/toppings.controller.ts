import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { ToppingsService } from './toppings.service';

@Controller('toppings')
export class ToppingsController {
  constructor(private readonly toppingsService: ToppingsService) {}

  @Get()
  findAll() {
    return this.toppingsService.findAll();
  }

  @Post()
  create(@Body() data: any) {
    return this.toppingsService.create(data);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.toppingsService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.toppingsService.remove(id);
  }
}
