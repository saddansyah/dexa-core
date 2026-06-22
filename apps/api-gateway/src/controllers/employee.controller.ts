import { Controller, Get, Inject, Param } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { SERVICES, COMMANDS, GetEmployeeByEmailDto, GetEmployeeByIdDto } from '@app/common';

@Controller('employee')
export class EmployeeController {
  constructor(
    @Inject(SERVICES.EMPLOYEE) private readonly employeeClient: ClientProxy,
  ) { }

  @Get(':id')
  getEmployeeById(@Param() params: GetEmployeeByIdDto) {
    return this.employeeClient.send({ cmd: COMMANDS.EMPLOYEE.GET_BY_ID }, { id: params.id });
  }

  @Get('email/:email')
  getEmployeeByEmail(@Param() params: GetEmployeeByEmailDto) {
    return this.employeeClient.send({ cmd: COMMANDS.EMPLOYEE.GET_BY_EMAIL }, { email: params.email });
  }
}
