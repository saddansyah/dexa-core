import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { DEFAULT_PORTS, MicroserviceExceptionFilter } from '@app/common';
import { AuthSvcModule } from './auth-svc.module';
import { ConsoleLogger } from '@nestjs/common';

async function bootstrap() {
  const host = process.env.AUTH_HOST ?? '127.0.0.1';
  const port = process.env.AUTH_PORT ? parseInt(process.env.AUTH_PORT, 10) : DEFAULT_PORTS.AUTH;
  const logger = new ConsoleLogger({
    json: true,
  })

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AuthSvcModule,
    {
      logger: logger,
      transport: Transport.TCP,
      options: {
        host,
        port,
      },
    },
  );
  app.useGlobalFilters(new MicroserviceExceptionFilter());
  await app.listen();
  logger.log(`Auth Microservice is listening on host ${host} port ${port}...`);
}
bootstrap();
