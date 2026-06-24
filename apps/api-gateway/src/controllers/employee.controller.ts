import { Controller, Get, Inject, Param, UseGuards, Post, Body, Patch, Query, Delete } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import {
  SERVICES,
  COMMANDS,
  GetEmployeeByEmailDto,
  GetEmployeeByIdDto,
  CreateEmployeeDto,
  UpdateEmployeeDto,
  GetEmployeesDto,
  AuthGuard,
  CurrentUser,
  RolesGuard,
  Roles,
  JwtPayloadDto,
  ApiOkResponseStandard,
  ApiOkResponseStandardArray,
  ApiCreatedResponseStandard,
  EmployeeResponseDto,
  SuccessResponseDto,
} from '@app/common';

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
  @ApiOkResponseStandard(EmployeeResponseDto)
  getMe(@CurrentUser() user: JwtPayloadDto) {
    return this.employeeClient.send({ cmd: COMMANDS.EMPLOYEE.GET_BY_ID }, { id: user.sub });
  }

  @Post()
  @Roles(['admin', 'hr'])
  @ApiOperation({ summary: 'Create a new employee profile (Admin/HR only)' })
  @ApiCreatedResponseStandard(EmployeeResponseDto)
  createEmployee(@Body() data: CreateEmployeeDto) {
    return this.employeeClient.send({ cmd: COMMANDS.EMPLOYEE.CREATE }, data);
  }

  @Get()
  @Roles(['admin', 'hr'])
  @ApiOperation({ summary: 'Get list of all employees (Admin/HR only)' })
  @ApiOkResponseStandardArray(EmployeeResponseDto)
  getAllEmployees(@Query() query: GetEmployeesDto) {
    return this.employeeClient.send({ cmd: COMMANDS.EMPLOYEE.GET_ALL }, query || {});
  }

  @Get(':id')
  @Roles(['admin', 'hr'])
  @ApiOperation({ summary: 'Get employee details by ID (Admin/HR only)' })
  @ApiParam({ name: 'id', type: 'string', description: 'The unique UUID v7 identifier of the employee' })
  @ApiOkResponseStandard(EmployeeResponseDto)
  getEmployeeById(@Param() params: GetEmployeeByIdDto) {
    return this.employeeClient.send({ cmd: COMMANDS.EMPLOYEE.GET_BY_ID }, { id: params.id });
  }

  @Get('email/:email')
  @Roles(['admin', 'hr'])
  @ApiOperation({ summary: 'Get employee details by email (Admin/HR only)' })
  @ApiParam({ name: 'email', type: 'string', description: 'The email address of the employee' })
  @ApiOkResponseStandard(EmployeeResponseDto)
  getEmployeeByEmail(@Param() params: GetEmployeeByEmailDto) {
    return this.employeeClient.send({ cmd: COMMANDS.EMPLOYEE.GET_BY_EMAIL }, { email: params.email });
  }

  @Patch(':id')
  @Roles(['admin', 'hr'])
  @ApiOperation({ summary: 'Update employee profile by ID (Admin/HR only)' })
  @ApiParam({ name: 'id', type: 'string', description: 'The unique UUID v7 identifier of the employee to update' })
  @ApiOkResponseStandard(EmployeeResponseDto)
  updateEmployee(@Param() params: GetEmployeeByIdDto, @Body() data: UpdateEmployeeDto) {
    return this.employeeClient.send({ cmd: COMMANDS.EMPLOYEE.UPDATE }, { id: params.id, updateData: data });
  }

  @Delete(':id')
  @Roles(['admin'])
  @ApiOperation({ summary: 'Delete employee profile by ID (Admin only)' })
  @ApiParam({ name: 'id', type: 'string', description: 'The unique UUID v7 identifier of the employee to delete' })
  @ApiOkResponseStandard(SuccessResponseDto)
  deleteEmployee(@Param() params: GetEmployeeByIdDto) {
    return this.employeeClient.send({ cmd: COMMANDS.EMPLOYEE.DELETE }, { id: params.id });
  }
}

