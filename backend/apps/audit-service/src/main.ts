import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { MQ_QUEUES } from '@app/common';
import { AuditServiceModule } from './audit-service.module';

async function bootstrap() {
  const rabbitmqUrl = process.env.RABBITMQ_URL ?? 'amqp://guest:guest@localhost:5672';

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AuditServiceModule, {
    transport: Transport.RMQ,
    options: {
      urls: [rabbitmqUrl],
      queue: MQ_QUEUES.AUDIT_EVENTS,
      queueOptions: { durable: true },
    },
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  await app.listen();
  Logger.log(`audit-service listening on queue "${MQ_QUEUES.AUDIT_EVENTS}"`, 'Bootstrap');
}
bootstrap();
