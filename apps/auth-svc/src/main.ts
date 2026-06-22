import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { DEFAULT_PORTS, RpcExceptionFilter } from '@app/common';
import { AuthSvcModule } from './auth-svc.module';

async function bootstrap() {
  const host = process.env.AUTH_HOST ?? '127.0.0.1';
  const port = process.env.AUTH_PORT ? parseInt(process.env.AUTH_PORT, 10) : DEFAULT_PORTS.AUTH;

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AuthSvcModule,
    {
      transport: Transport.TCP,
      options: {
        host,
        port,
      },
    },
  );
  app.useGlobalFilters(new RpcExceptionFilter());
  await app.listen();
  console.log(`Auth Microservice is listening on host ${host} port ${port}...`);
}
bootstrap();
