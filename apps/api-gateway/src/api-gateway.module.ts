import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SERVICES, DEFAULT_PORTS } from '@app/common';
import { ApiGatewayController } from './api-gateway.controller';
import { ApiGatewayService } from './api-gateway.service';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';

@Module({
  imports: [
    WinstonModule.forRoot({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
      // TODO: configurable log info by NODE_ENV or something
      transports: [
        new winston.transports.Console({
          level: 'debug',
        }),
      ],
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    ClientsModule.registerAsync([
      {
        name: SERVICES.AUTH,
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get<string>('AUTH_HOST', '127.0.0.1'),
            port: configService.get<number>('AUTH_PORT', DEFAULT_PORTS.AUTH),
          },
        }),
        inject: [ConfigService],
      },
      {
        name: SERVICES.FILE,
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get<string>('FILE_HOST', '127.0.0.1'),
            port: configService.get<number>('FILE_PORT', DEFAULT_PORTS.FILE),
          },
        }),
        inject: [ConfigService],
      },
      {
        name: SERVICES.ATTENDANCE,
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get<string>('ATTENDANCE_HOST', '127.0.0.1'),
            port: configService.get<number>('ATTENDANCE_PORT', DEFAULT_PORTS.ATTENDANCE),
          },
        }),
        inject: [ConfigService],
      },
      {
        name: SERVICES.EMPLOYEE,
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get<string>('EMPLOYEE_HOST', '127.0.0.1'),
            port: configService.get<number>('EMPLOYEE_PORT', DEFAULT_PORTS.EMPLOYEE),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [ApiGatewayController],
  providers: [ApiGatewayService],
})
export class ApiGatewayModule { }
