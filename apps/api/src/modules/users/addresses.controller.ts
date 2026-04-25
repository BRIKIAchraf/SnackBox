import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('addresses')
@UseGuards(JwtAuthGuard)
export class AddressesController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async findAll(@Request() req: any) {
    return this.prisma.address.findMany({
      where: { userId: req.user.userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  @Post()
  async create(@Request() req: any, @Body() data: any) {
    return this.prisma.address.create({
      data: {
        ...data,
        userId: req.user.userId,
      },
    });
  }

  @Put(':id')
  async update(@Param('id') id: string, @Request() req: any, @Body() data: any) {
    return this.prisma.address.update({
      where: { id, userId: req.user.userId },
      data,
    });
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req: any) {
    return this.prisma.address.delete({
      where: { id, userId: req.user.userId },
    });
  }
}
