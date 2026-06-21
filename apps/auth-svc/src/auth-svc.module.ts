import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthSvcController } from './auth-svc.controller';
import { AuthSvcService } from './auth-svc.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [AuthSvcController],
  providers: [AuthSvcService],
})
export class AuthSvcModule {}
