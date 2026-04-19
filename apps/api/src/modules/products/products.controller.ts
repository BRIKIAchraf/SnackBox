import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards, Request, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CacheInterceptor, CacheKey } from '@nestjs/cache-manager';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

// Configure Cloudinary early in the file
cloudinary.config({
  cloudinary_url: process.env.CLOUDINARY_URL
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'products',
    allowed_formats: ['jpg', 'png', 'webp', 'jpeg'],
    transformation: [{ width: 800, height: 800, crop: 'limit', quality: 'auto', fetch_format: 'auto' }]
  } as any,
});

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

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
  @UseInterceptors(FilesInterceptor('images', 5, { storage, limits: { fileSize: 5 * 1024 * 1024 } }))
  create(@Body() body: any, @UploadedFiles() files: Array<Express.Multer.File>, @Request() req: any) {
    const images = files ? files.map(file => file.path) : [];
    
    // Transform price if it comes as string (FormData sends everything as string)
    const data = {
        ...body,
        price: parseFloat(body.price),
        images: images.length > 0 ? images : undefined,
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
  @UseInterceptors(FilesInterceptor('images', 5, { storage, limits: { fileSize: 5 * 1024 * 1024 } }))
  update(@Param('id') id: string, @Body() body: any, @UploadedFiles() files: Array<Express.Multer.File>, @Request() req: any) {
    const images = files ? files.map(file => file.path) : [];

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
