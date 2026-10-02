import { Logger } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { EmployeeProfileUpdatedEvent } from '@app/common';

@WebSocketGateway({ cors: { origin: '*' }, namespace: 'notifications' })
export class NotificationGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(NotificationGateway.name);

  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    this.logger.log(`Admin notification client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Admin notification client disconnected: ${client.id}`);
  }

  broadcastProfileUpdated(event: EmployeeProfileUpdatedEvent) {
    this.server.emit('employee-profile-updated', event);
  }
}
