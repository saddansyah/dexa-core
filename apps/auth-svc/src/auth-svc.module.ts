import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthSvcController } from './auth-svc.controller';
import { AuthSvcService } from './auth-svc.service';
import { DatabaseModule } from '@app/database';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRY', '1d') as any,
        },
      }),
    }),
  ],
  controllers: [AuthSvcController],
  providers: [AuthSvcService],
})
export class AuthSvcModule { }
