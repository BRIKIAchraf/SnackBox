import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards, Request, UseInterceptors, UploadedFile } from '@nestjs/common';
import { OffersService } from './offers.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

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
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: './uploads/products', // Reuse products folder for pack images
      filename: (req, file, cb) => {
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
        return cb(null, `${randomName}${extname(file.originalname)}`);
      }
    })
  }))
  create(@Body() body: any, @UploadedFile() file: Express.Multer.File, @Request() req: any) {
    const data = {
        ...body,
        price: parseFloat(body.price),
        imagePath: file ? `/uploads/products/${file.filename}` : null
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
    return this.offersService.update(id, data, req.user.userId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  delete(@Param('id') id: string) {
    return this.offersService.softDelete(id);
  }
}
