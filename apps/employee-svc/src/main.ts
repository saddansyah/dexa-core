import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { DEFAULT_PORTS } from '@app/common';
import { EmployeeSvcModule } from './employee-svc.module';

async function bootstrap() {
  const host = process.env.EMPLOYEE_HOST ?? '127.0.0.1';
  const port = process.env.EMPLOYEE_PORT ? parseInt(process.env.EMPLOYEE_PORT, 10) : DEFAULT_PORTS.EMPLOYEE;

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    EmployeeSvcModule,
    {
      transport: Transport.TCP,
      options: {
        host,
        port,
      },
    },
  );
  await app.listen();
  console.log(`Employee Microservice is listening on host ${host} port ${port}...`);
}
bootstrap();
