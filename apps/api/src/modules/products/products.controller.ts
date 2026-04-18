import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards, Request, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { CacheInterceptor, CacheKey } from '@nestjs/cache-manager';

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
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: './uploads/products',
      filename: (req, file, cb) => {
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
        return cb(null, `${randomName}${extname(file.originalname)}`);
      }
    })
  }))
  create(@Body() body: any, @UploadedFile() file: Express.Multer.File, @Request() req: any) {
    // Transform price if it comes as string (FormData sends everything as string)
    const data = {
        ...body,
        price: parseFloat(body.price),
        imagePath: file ? `/uploads/products/${file.filename}` : null
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
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: './uploads/products',
      filename: (req, file, cb) => {
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
        return cb(null, `${randomName}${extname(file.originalname)}`);
      }
    })
  }))
  update(@Param('id') id: string, @Body() body: any, @UploadedFile() file: Express.Multer.File, @Request() req: any) {
    const data = {
        ...body,
        price: body.price ? parseFloat(body.price) : undefined,
        imagePath: file ? `/uploads/products/${file.filename}` : undefined
    };
    return this.productsService.update(id, data, req.user.userId);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.productsService.softDelete(id);
  }
}
