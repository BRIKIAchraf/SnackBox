import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { NotificationsGateway } from './notifications.gateway';
import { Job } from 'bullmq';

@Processor('notifications')
export class NotificationsProcessor extends WorkerHost {
  private readonly logger = new Logger(NotificationsProcessor.name);

  constructor(private readonly notificationsGateway: NotificationsGateway) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    this.logger.debug(`Processing job ${job.id} of type ${job.name}`);
    
    try {
      switch (job.name) {
        case 'new-order':
          this.notificationsGateway.notifyNewOrder(job.data.order);
          break;
        case 'status-update':
          this.notificationsGateway.notifyStatusUpdate(job.data.orderId, job.data.status);
          break;
        case 'menu-update':
          this.notificationsGateway.notifyMenuUpdate();
          break;
        default:
          this.logger.warn(`Unknown job name: ${job.name}`);
      }
    } catch (error) {
      this.logger.error(`Error processing job ${job.id}`, error);
      throw error;
    }
  }
}
