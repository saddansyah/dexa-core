import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { SERVICES, COMMANDS } from '@app/common';
import { ApiGatewayService } from './api-gateway.service';

@Controller()
export class ApiGatewayController {
  constructor(
    private readonly apiGatewayService: ApiGatewayService,
    @Inject(SERVICES.AUTH) private readonly authClient: ClientProxy,
    @Inject(SERVICES.FILE) private readonly fileClient: ClientProxy,
    @Inject(SERVICES.ATTENDANCE) private readonly attendanceClient: ClientProxy,
    @Inject(SERVICES.EMPLOYEE) private readonly employeeClient: ClientProxy,
  ) { }

  @Get()
  getHello(): string {
    return this.apiGatewayService.getHello();
  }

  @Get('auth/test')
  testAuth() {
    return this.authClient.send({ cmd: COMMANDS.AUTH.TEST }, { message: 'Ping from Gateway to Auth' });
  }

  @Get('file/test')
  testFile() {
    return this.fileClient.send({ cmd: COMMANDS.FILE.TEST }, { message: 'Ping from Gateway to File' });
  }

  @Get('attendance/test')
  testAttendance() {
    return this.attendanceClient.send({ cmd: COMMANDS.ATTENDANCE.TEST }, { message: 'Ping from Gateway to Attendance' });
  }

  @Get('employee/test')
  testEmployee() {
    return this.employeeClient.send({ cmd: COMMANDS.EMPLOYEE.TEST }, { message: 'Ping from Gateway to Employee' });
  }
}
