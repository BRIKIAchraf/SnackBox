import { Controller, Get, Post, Body } from '@nestjs/common';
import { ContactService } from './contact.service';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  create(@Body() data: { name: string; email: string; message: string }) {
    return this.contactService.create(data);
  }

  @Get()
  findAll() {
    return this.contactService.findAll();
  }
}
