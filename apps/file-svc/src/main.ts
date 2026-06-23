import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { DEFAULT_PORTS, MicroserviceExceptionFilter } from '@app/common';
import { ZodValidationPipe } from 'nestjs-zod';
import { FileSvcModule } from './file-svc.module';
import { ConsoleLogger } from '@nestjs/common';

async function bootstrap() {
  const host = process.env.FILE_HOST ?? '127.0.0.1';
  const port = process.env.FILE_PORT ? parseInt(process.env.FILE_PORT, 10) : DEFAULT_PORTS.FILE;

  const logger = new ConsoleLogger({
    json: true
  })
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    FileSvcModule,
    {
      logger,
      transport: Transport.TCP,
      options: {
        host,
        port,
      },
    },
  );

  app.useGlobalPipes(new ZodValidationPipe());
  app.useGlobalFilters(new MicroserviceExceptionFilter());

  await app.listen();
  logger.log(`File Microservice is listening on host ${host} port ${port}...`);
}
bootstrap();
