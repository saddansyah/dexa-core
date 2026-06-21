import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EmployeeSvcController } from './employee-svc.controller';
import { EmployeeSvcService } from './employee-svc.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [EmployeeSvcController],
  providers: [EmployeeSvcService],
})
export class EmployeeSvcModule {}
