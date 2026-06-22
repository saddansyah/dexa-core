import { Controller, Get, Inject, Param, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { SERVICES, COMMANDS, GetEmployeeByEmailDto, GetEmployeeByIdDto, AuthGuard, CurrentUser, RolesGuard, Roles } from '@app/common';

@Controller('employee')
@UseGuards(AuthGuard, RolesGuard)
export class EmployeeController {
  constructor(
    @Inject(SERVICES.EMPLOYEE) private readonly employeeClient: ClientProxy,
  ) { }

  @Get('me')
  @Roles(['Admin', 'HR', 'Employee'])
  getMe(@CurrentUser() user: any) {
    return user;
  }

  @Get(':id')
  @Roles(['Admin'])
  getEmployeeById(@Param() params: GetEmployeeByIdDto) {
    return this.employeeClient.send({ cmd: COMMANDS.EMPLOYEE.GET_BY_ID }, { id: params.id });
  }

  @Get('email/:email')
  @Roles(['Admin'])
  getEmployeeByEmail(@Param() params: GetEmployeeByEmailDto) {
    return this.employeeClient.send({ cmd: COMMANDS.EMPLOYEE.GET_BY_EMAIL }, { email: params.email });
  }
}
