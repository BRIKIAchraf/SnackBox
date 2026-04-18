import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello() {
    return {
      message: 'Welcome to Pizza Hub API',
      version: 'v1.0.0',
      status: 'online',
    };
  }
}
