import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('NotificationsGateway');

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  notifyNewOrder(order: any) {
    this.logger.log(`Broadcasting new order: ${order.id}`);
    this.server.emit('new_order', order);
  }

  notifyStatusUpdate(orderId: string, status: string) {
    this.server.emit('order_status_updated', { orderId, status });
  }

  notifyMenuUpdate() {
    this.server.emit('menu_updated');
  }

  notifyCategoryUpdate() {
    this.server.emit('categories_updated');
  }

  notifyZoneUpdate() {
    this.server.emit('zones_updated');
  }
}
