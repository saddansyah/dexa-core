import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AttendanceSvcController } from './attendance-svc.controller';
import { AttendanceSvcService } from './attendance-svc.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [AttendanceSvcController],
  providers: [AttendanceSvcService],
})
export class AttendanceSvcModule {}
