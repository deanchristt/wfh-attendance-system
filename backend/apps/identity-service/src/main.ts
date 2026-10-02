import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { MQ_QUEUES } from '@app/common';
import { IdentityServiceModule } from './identity-service.module';

async function bootstrap() {
  const rabbitmqUrl = process.env.RABBITMQ_URL ?? 'amqp://guest:guest@localhost:5672';

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(IdentityServiceModule, {
    transport: Transport.RMQ,
    options: {
      urls: [rabbitmqUrl],
      queue: MQ_QUEUES.IDENTITY_RPC,
      queueOptions: { durable: true },
    },
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  await app.listen();
  Logger.log(`identity-service listening on queue "${MQ_QUEUES.IDENTITY_RPC}"`, 'Bootstrap');
}
bootstrap();
