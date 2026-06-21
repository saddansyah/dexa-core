import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { DEFAULT_PORTS } from '@app/common';
import { AttendanceSvcModule } from './attendance-svc.module';

async function bootstrap() {
  const host = process.env.ATTENDANCE_HOST ?? '127.0.0.1';
  const port = process.env.ATTENDANCE_PORT ? parseInt(process.env.ATTENDANCE_PORT, 10) : DEFAULT_PORTS.ATTENDANCE;

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AttendanceSvcModule,
    {
      transport: Transport.TCP,
      options: {
        host,
        port,
      },
    },
  );
  await app.listen();
  console.log(`Attendance Microservice is listening on host ${host} port ${port}...`);
}
bootstrap();
