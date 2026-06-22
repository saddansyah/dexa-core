import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { SERVICES, COMMANDS } from '@app/common';

@Controller('employee')
export class EmployeeController {
  constructor(
    @Inject(SERVICES.EMPLOYEE) private readonly employeeClient: ClientProxy,
  ) {}

  @Get('test')
  testEmployee() {
    return this.employeeClient.send({ cmd: COMMANDS.EMPLOYEE.TEST }, { message: 'Ping from Gateway to Employee' });
  }
}
