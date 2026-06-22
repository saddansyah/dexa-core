import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@app/database';
import { EmployeeSvcController } from './employee-svc.controller';
import { EmployeeSvcService } from './employee-svc.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
  ],
  controllers: [EmployeeSvcController],
  providers: [EmployeeSvcService],
})
export class EmployeeSvcModule { }
