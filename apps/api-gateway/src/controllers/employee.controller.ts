import { Controller, Get, Inject, Param, UseGuards, Post, Body, Patch, Query, Delete } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { SERVICES, COMMANDS, GetEmployeeByEmailDto, GetEmployeeByIdDto, CreateEmployeeDto, UpdateEmployeeDto, GetEmployeesDto, AuthGuard, CurrentUser, RolesGuard, Roles } from '@app/common';

@Controller('employee')
@UseGuards(AuthGuard, RolesGuard)
export class EmployeeController {
  constructor(
    @Inject(SERVICES.EMPLOYEE) private readonly employeeClient: ClientProxy,
  ) { }

  @Get('me')
  @Roles(['admin', 'hr', 'employee'])
  getMe(@CurrentUser() user: any) {
    return user;
  }

  @Post()
  @Roles(['admin', 'hr'])
  createEmployee(@Body() data: CreateEmployeeDto) {
    return this.employeeClient.send({ cmd: COMMANDS.EMPLOYEE.CREATE }, data);
  }

  @Get()
  @Roles(['admin', 'hr'])
  getAllEmployees(@Query() query: GetEmployeesDto) {
    return this.employeeClient.send({ cmd: COMMANDS.EMPLOYEE.GET_ALL }, query || {});
  }

  @Get(':id')
  @Roles(['admin', 'hr'])
  getEmployeeById(@Param() params: GetEmployeeByIdDto) {
    return this.employeeClient.send({ cmd: COMMANDS.EMPLOYEE.GET_BY_ID }, { id: params.id });
  }

  @Get('email/:email')
  @Roles(['admin', 'hr'])
  getEmployeeByEmail(@Param() params: GetEmployeeByEmailDto) {
    return this.employeeClient.send({ cmd: COMMANDS.EMPLOYEE.GET_BY_EMAIL }, { email: params.email });
  }

  @Patch(':id')
  @Roles(['admin', 'hr'])
  updateEmployee(@Param() params: GetEmployeeByIdDto, @Body() data: UpdateEmployeeDto) {
    return this.employeeClient.send({ cmd: COMMANDS.EMPLOYEE.UPDATE }, { id: params.id, updateData: data });
  }

  @Delete(':id')
  @Roles(['admin'])
  deleteEmployee(@Param() params: GetEmployeeByIdDto) {
    return this.employeeClient.send({ cmd: COMMANDS.EMPLOYEE.DELETE }, { id: params.id });
  }
}

