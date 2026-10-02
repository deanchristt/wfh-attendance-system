import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RmqClientsModule } from './clients/rmq-clients.module';
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';
import { AttendanceModule } from './attendance/attendance.module';
import { AdminModule } from './admin/admin.module';
import { NotificationModule } from './notification/notification.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    RmqClientsModule,
    AuthModule,
    ProfileModule,
    AttendanceModule,
    AdminModule,
    NotificationModule,
  ],
})
export class GatewayModule {}
