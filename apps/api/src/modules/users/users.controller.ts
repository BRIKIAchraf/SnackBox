import { Controller, Get, UseGuards, Delete, Param, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  findAll() {
    return this.usersService.findAll();
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.usersService.softDelete(id);
  }

  @Post('convert-guest')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  convertGuestToUser(@Body() body: { orderId: string, email: string, phone?: string }) {
    return this.usersService.convertGuestToUser(body.orderId, body.email, body.phone);
  }
}
