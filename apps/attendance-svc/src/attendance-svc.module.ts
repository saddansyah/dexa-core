import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@app/database';
import { AttendanceSvcController } from './attendance-svc.controller';
import { AttendanceSvcService } from './attendance-svc.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
  ],
  controllers: [AttendanceSvcController],
  providers: [AttendanceSvcService],
})
export class AttendanceSvcModule {}

