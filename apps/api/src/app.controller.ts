import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello() {
    return this.appService.getHello();
  }

  @Get('test-prefix')
  testPrefix() {
    return { status: 'ok', message: 'Prefix is working' };
  }
}
