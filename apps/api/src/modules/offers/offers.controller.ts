import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards, Request, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { OffersService } from './offers.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { FilesInterceptor } from '@nestjs/platform-express';
import { MediaService } from '../media/media.service';
import { memoryStorage } from 'multer';

@Controller('offers')
export class OffersController {
  constructor(
    private readonly offersService: OffersService,
    private readonly mediaService: MediaService
  ) {}

  @Get()
  findAll() {
    return this.offersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.offersService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @UseInterceptors(FilesInterceptor('images', 5, { storage: memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } }))
  async create(@Body() body: any, @UploadedFiles() files: Array<Express.Multer.File>, @Request() req: any) {
    const images = files && files.length > 0 ? await this.mediaService.uploadFiles(files, 'offers') : [];

    const data = {
        ...body,
        price: parseFloat(body.price),
        images: images.length > 0 ? images : (body.imageUrl ? [body.imageUrl] : undefined)
    };
    return this.offersService.create(data, req.user.userId);
  }

  @Patch(':id/availability')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  updateAvailability(@Param('id') id: string, @Body('available') available: boolean) {
    return this.offersService.updateAvailability(id, available);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @UseInterceptors(FilesInterceptor('images', 5, { storage: memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } }))
  async update(@Param('id') id: string, @Body() body: any, @UploadedFiles() files: Array<Express.Multer.File>, @Request() req: any) {
    const images = files && files.length > 0 ? await this.mediaService.uploadFiles(files, 'offers') : [];

    const data = {
        ...body,
        price: body.price ? parseFloat(body.price) : undefined,
        images: images.length > 0 ? images : undefined
    };
    return this.offersService.update(id, data, req.user.userId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  delete(@Param('id') id: string) {
    return this.offersService.softDelete(id);
  }
}
