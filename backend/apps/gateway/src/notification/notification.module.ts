import { Module } from '@nestjs/common';
import { NotificationGateway } from './notification.gateway';
import { NotificationListenerController } from './notification-listener.controller';

@Module({
  controllers: [NotificationListenerController],
  providers: [NotificationGateway],
})
export class NotificationModule {}
