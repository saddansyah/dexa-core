import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SERVICES, DEFAULT } from '@app/common';
import { ApiGatewayController } from './api-gateway.controller';
import { ApiGatewayService } from './api-gateway.service';
import { AuthController } from './controllers/auth.controller';
import { FileController } from './controllers/file.controller';
import { AttendanceController } from './controllers/attendance.controller';
import { EmployeeController } from './controllers/employee.controller';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ClientsModule.registerAsync([
      {
        name: SERVICES.AUTH,
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get<string>('AUTH_HOST', DEFAULT.HOST),
            port: configService.get<number>('AUTH_PORT', DEFAULT.PORTS.AUTH),
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
            host: configService.get<string>('FILE_HOST', DEFAULT.HOST),
            port: configService.get<number>('FILE_PORT', DEFAULT.PORTS.FILE),
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
            host: configService.get<string>('ATTENDANCE_HOST', DEFAULT.HOST),
            port: configService.get<number>('ATTENDANCE_PORT', DEFAULT.PORTS.ATTENDANCE),
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
            host: configService.get<string>('EMPLOYEE_HOST', DEFAULT.HOST),
            port: configService.get<number>('EMPLOYEE_PORT', DEFAULT.PORTS.EMPLOYEE),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [
    ApiGatewayController,
    AuthController,
    FileController,
    AttendanceController,
    EmployeeController,
  ],
  providers: [ApiGatewayService],
})
export class ApiGatewayModule { }