import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { MQ_QUEUES } from '@app/common';
import { AttendanceServiceModule } from './attendance-service.module';

async function bootstrap() {
  const rabbitmqUrl = process.env.RABBITMQ_URL ?? 'amqp://guest:guest@localhost:5672';

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AttendanceServiceModule, {
    transport: Transport.RMQ,
    options: {
      urls: [rabbitmqUrl],
      queue: MQ_QUEUES.ATTENDANCE_RPC,
      queueOptions: { durable: true },
    },
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  await app.listen();
  Logger.log(`attendance-service listening on queue "${MQ_QUEUES.ATTENDANCE_RPC}"`, 'Bootstrap');
}
bootstrap();
