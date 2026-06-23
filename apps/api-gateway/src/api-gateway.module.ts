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
import { DepartmentController } from './controllers/department.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
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
    DepartmentController,
  ],
  providers: [ApiGatewayService],
})
export class ApiGatewayModule { }