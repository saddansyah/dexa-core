import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { DEFAULT_PORTS, MicroserviceExceptionFilter } from '@app/common';
import { AttendanceSvcModule } from './attendance-svc.module';
import { ConsoleLogger } from '@nestjs/common';

async function bootstrap() {
  const host = process.env.ATTENDANCE_HOST ?? '127.0.0.1';
  const port = process.env.ATTENDANCE_PORT ? parseInt(process.env.ATTENDANCE_PORT, 10) : DEFAULT_PORTS.ATTENDANCE;
  const logger = new ConsoleLogger({
    json: true,
  })

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AttendanceSvcModule,
    {
      logger,
      transport: Transport.TCP,
      options: {
        host,
        port,
      },
    },
  );
  app.useGlobalFilters(new MicroserviceExceptionFilter());
  await app.listen();
  console.log(`Attendance Microservice is listening on host ${host} port ${port}...`);
}
bootstrap();
