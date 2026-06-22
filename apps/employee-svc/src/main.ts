import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { DEFAULT_PORTS, ResponseInterceptor, RpcExceptionFilter } from '@app/common';
import { EmployeeSvcModule } from './employee-svc.module';
import { ConsoleLogger } from '@nestjs/common';

async function bootstrap() {
  const host = process.env.EMPLOYEE_HOST ?? '127.0.0.1';
  const port = process.env.EMPLOYEE_PORT ? parseInt(process.env.EMPLOYEE_PORT, 10) : DEFAULT_PORTS.EMPLOYEE;

  const logger = new ConsoleLogger({
    json: true,
  })

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    EmployeeSvcModule,
    {
      logger: logger,
      transport: Transport.TCP,
      options: {
        host,
        port,
      },
    },
  );

  app.useGlobalFilters(new RpcExceptionFilter());

  await app.listen();

  logger.log(`Employee Microservice is listening on host ${host} port ${port}...`);
}
bootstrap();
