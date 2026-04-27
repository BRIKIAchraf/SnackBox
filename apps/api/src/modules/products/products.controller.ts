import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards, Request, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CacheInterceptor, CacheKey } from '@nestjs/cache-manager';
import { MediaService } from '../media/media.service';
import { memoryStorage } from 'multer';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly mediaService: MediaService
  ) {}

  @Get()
  @UseInterceptors(CacheInterceptor)
  @CacheKey('menu:products')
  findAll() {
    return this.productsService.findAll();
  }

  @Get('toppings')
  findAllToppings() {
    return this.productsService.findAllToppings();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @UseInterceptors(FilesInterceptor('images', 5, { storage: memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } }))
  async create(@Body() body: any, @UploadedFiles() files: Array<Express.Multer.File>, @Request() req: any) {
    const images = files && files.length > 0 ? await this.mediaService.uploadFiles(files, 'products') : [];
    
    const data = {
        ...body,
        price: parseFloat(body.price),
        images: images.length > 0 ? images : (body.imageUrl ? [body.imageUrl] : undefined),
    };
    return this.productsService.create(data, req.user.userId);
  }

  @Patch(':id/availability')
  updateAvailability(@Param('id') id: string, @Body('available') available: boolean) {
    return this.productsService.updateAvailability(id, available);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @UseInterceptors(FilesInterceptor('images', 5, { storage: memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } }))
  async update(@Param('id') id: string, @Body() body: any, @UploadedFiles() files: Array<Express.Multer.File>, @Request() req: any) {
    const images = files && files.length > 0 ? await this.mediaService.uploadFiles(files, 'products') : [];

    const data = {
        ...body,
        price: body.price ? parseFloat(body.price) : undefined,
        images: images.length > 0 ? images : undefined
    };
    return this.productsService.update(id, data, req.user.userId);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.productsService.softDelete(id);
  }
}
