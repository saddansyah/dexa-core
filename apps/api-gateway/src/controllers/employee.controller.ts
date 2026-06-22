import { Controller, Get, Inject, Param, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { SERVICES, COMMANDS, GetEmployeeByEmailDto, GetEmployeeByIdDto, AuthGuard, CurrentUser } from '@app/common';

@Controller('employee')
@UseGuards(AuthGuard)
export class EmployeeController {
  constructor(
    @Inject(SERVICES.EMPLOYEE) private readonly employeeClient: ClientProxy,
  ) { }

  @Get('me')
  getMe(@CurrentUser() user: any) {
    return user;
  }

  @Get(':id')
  getEmployeeById(@Param() params: GetEmployeeByIdDto) {
    return this.employeeClient.send({ cmd: COMMANDS.EMPLOYEE.GET_BY_ID }, { id: params.id });
  }

  @Get('email/:email')
  getEmployeeByEmail(@Param() params: GetEmployeeByEmailDto) {
    return this.employeeClient.send({ cmd: COMMANDS.EMPLOYEE.GET_BY_EMAIL }, { email: params.email });
  }
}
