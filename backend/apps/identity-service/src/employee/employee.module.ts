import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MQ_CLIENTS, MQ_QUEUES } from '@app/common';
import { Employee } from '../entities/employee.entity';
import { EmployeeController } from './employee.controller';
import { EmployeeService } from './employee.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Employee]),
    ClientsModule.registerAsync([
      {
        name: MQ_CLIENTS.AUDIT,
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [config.get<string>('RABBITMQ_URL')],
            queue: MQ_QUEUES.AUDIT_EVENTS,
            queueOptions: { durable: true },
          },
        }),
      },
      {
        name: MQ_CLIENTS.NOTIFY,
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [config.get<string>('RABBITMQ_URL')],
            queue: MQ_QUEUES.NOTIFY_EVENTS,
            queueOptions: { durable: true },
          },
        }),
      },
    ]),
  ],
  controllers: [EmployeeController],
  providers: [EmployeeService],
})
export class EmployeeModule {}
