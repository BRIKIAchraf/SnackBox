import { Controller, Get, Post, Body, Param, Patch, UseGuards, Request, UnauthorizedException } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get('stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  getStats() {
    return this.ordersService.getDashboardStats();
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Request() req: any) {
    const userId = req.user.role === 'ADMIN' ? undefined : req.user.userId;
    return this.ordersService.findAll(userId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string, @Request() req: any) {
    const order = await this.ordersService.findOne(id);
    if (!order) return null;
    if (req.user.role !== 'ADMIN' && order.userId !== req.user.userId) {
        throw new UnauthorizedException('You do not have access to this order');
    }
    return order;
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createOrderDto: any, @Request() req: any) {
    return this.ordersService.create({ ...createOrderDto, userId: req.user.userId });
  }

  @Post('validate-cart')
  validateCart(@Body() data: any) {
    return this.ordersService.validateCart(
      data.items, 
      data.offers, 
      data.deliveryZoneId, 
      data.lat, 
      data.lng, 
      data.zipCode
    );
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: string, @Body('adminUserId') adminUserId: string) {
    return this.ordersService.updateStatus(id, status, adminUserId);
  }
}
