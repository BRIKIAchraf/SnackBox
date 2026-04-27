import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:3001', 'https://snack-box-client.vercel.app', 'https://snack-box-admin.vercel.app'],
    credentials: true,
    methods: ['GET', 'POST'],
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

  @SubscribeMessage('join_order')
  handleJoinOrder(client: Socket, orderId: string) {
    client.join(`order_${orderId}`);
    this.logger.log(`Client ${client.id} joined room: order_${orderId}`);
  }

  @SubscribeMessage('join_user')
  handleJoinUser(client: Socket, userId: string) {
    client.join(`user_${userId}`);
    this.logger.log(`Client ${client.id} joined room: user_${userId}`);
  }

  @SubscribeMessage('join_admin')
  handleJoinAdmin(client: Socket) {
    client.join('admins');
    this.logger.log(`Client ${client.id} joined room: admins`);
  }

  notifyNewOrder(order: any) {
    this.logger.log(`Broadcasting new order to admins: ${order.id}`);
    this.server.to('admins').emit('new_order', order);
  }

  notifyStatusUpdate(orderId: string, status: string) {
    this.logger.log(`Notifying status update for order ${orderId}: ${status}`);
    this.server.to(`order_${orderId}`).emit('order_status_updated', { orderId, status });
    // Also notify admins
    this.server.to('admins').emit('order_status_updated', { orderId, status });
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
