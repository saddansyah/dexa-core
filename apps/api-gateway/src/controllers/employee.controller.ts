import { Controller, Get, Inject, Param, UseGuards, Post, Body, Patch, Query, Delete } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { SERVICES, COMMANDS, GetEmployeeByEmailDto, GetEmployeeByIdDto, CreateEmployeeDto, UpdateEmployeeDto, GetEmployeesDto, AuthGuard, CurrentUser, RolesGuard, Roles, JwtPayloadDto } from '@app/common';

@ApiTags('Employee')
@Controller('employee')
@UseGuards(AuthGuard, RolesGuard)
export class EmployeeController {
  constructor(
    @Inject(SERVICES.EMPLOYEE) private readonly employeeClient: ClientProxy,
  ) { }

  @Get('me')
  @Roles(['admin', 'hr', 'employee'])
  @ApiOperation({ summary: 'Get current logged-in employee details' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved profile details' })
  getMe(@CurrentUser() user: JwtPayloadDto) {
    return this.employeeClient.send({ cmd: COMMANDS.EMPLOYEE.GET_BY_ID }, { id: user.sub });
  }

  @Post()
  @Roles(['admin', 'hr'])
  @ApiOperation({ summary: 'Create a new employee profile (Admin/HR only)' })
  @ApiResponse({ status: 201, description: 'Successfully created employee profile' })
  createEmployee(@Body() data: CreateEmployeeDto) {
    return this.employeeClient.send({ cmd: COMMANDS.EMPLOYEE.CREATE }, data);
  }

  @Get()
  @Roles(['admin', 'hr'])
  @ApiOperation({ summary: 'Get list of all employees (Admin/HR only)' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved list of employees' })
  getAllEmployees(@Query() query: GetEmployeesDto) {
    return this.employeeClient.send({ cmd: COMMANDS.EMPLOYEE.GET_ALL }, query || {});
  }

  @Get(':id')
  @Roles(['admin', 'hr'])
  @ApiOperation({ summary: 'Get employee details by ID (Admin/HR only)' })
  @ApiParam({ name: 'id', type: 'string', description: 'The unique UUID v7 identifier of the employee' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved employee details' })
  getEmployeeById(@Param() params: GetEmployeeByIdDto) {
    return this.employeeClient.send({ cmd: COMMANDS.EMPLOYEE.GET_BY_ID }, { id: params.id });
  }

  @Get('email/:email')
  @Roles(['admin', 'hr'])
  @ApiOperation({ summary: 'Get employee details by email (Admin/HR only)' })
  @ApiParam({ name: 'email', type: 'string', description: 'The email address of the employee' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved employee details' })
  getEmployeeByEmail(@Param() params: GetEmployeeByEmailDto) {
    return this.employeeClient.send({ cmd: COMMANDS.EMPLOYEE.GET_BY_EMAIL }, { email: params.email });
  }

  @Patch(':id')
  @Roles(['admin', 'hr'])
  @ApiOperation({ summary: 'Update employee profile by ID (Admin/HR only)' })
  @ApiParam({ name: 'id', type: 'string', description: 'The unique UUID v7 identifier of the employee to update' })
  @ApiResponse({ status: 200, description: 'Successfully updated employee profile' })
  updateEmployee(@Param() params: GetEmployeeByIdDto, @Body() data: UpdateEmployeeDto) {
    return this.employeeClient.send({ cmd: COMMANDS.EMPLOYEE.UPDATE }, { id: params.id, updateData: data });
  }

  @Delete(':id')
  @Roles(['admin'])
  @ApiOperation({ summary: 'Delete employee profile by ID (Admin only)' })
  @ApiParam({ name: 'id', type: 'string', description: 'The unique UUID v7 identifier of the employee to delete' })
  @ApiResponse({ status: 200, description: 'Successfully deleted employee profile' })
  deleteEmployee(@Param() params: GetEmployeeByIdDto) {
    return this.employeeClient.send({ cmd: COMMANDS.EMPLOYEE.DELETE }, { id: params.id });
  }
}

