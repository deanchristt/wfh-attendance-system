import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attendance } from './entities/attendance.entity';
import { AttendanceModule } from './attendance/attendance.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('ATTENDANCE_DB_HOST', 'localhost'),
        port: config.get<number>('ATTENDANCE_DB_PORT', 5432),
        username: config.get<string>('ATTENDANCE_DB_USER', 'postgres'),
        password: config.get<string>('ATTENDANCE_DB_PASSWORD', 'postgres'),
        database: config.get<string>('ATTENDANCE_DB_NAME', 'dexa_attendance'),
        entities: [Attendance],
        synchronize: true,
      }),
    }),
    AttendanceModule,
  ],
})
export class AttendanceServiceModule {}
