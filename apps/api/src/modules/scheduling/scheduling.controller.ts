import { Controller, Get, Query } from '@nestjs/common';
import { SchedulingService } from './scheduling.service';

@Controller('scheduling')
export class SchedulingController {
  constructor(private readonly schedulingService: SchedulingService) {}

  @Get('slots')
  getSlots(@Query('date') date: string) {
    return this.schedulingService.getAvailableSlots(date);
  }
}
