import { Controller, Get, Inject, UseGuards, Post, Body, Query, Param, Patch, Delete } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { SERVICES, COMMANDS, AuthGuard, RolesGuard, Roles, CreateDepartmentDto, UpdateDepartmentDto, GetDepartmentsDto, GetDepartmentByIdDto } from '@app/common';

@ApiTags('Department')
@Controller('department')
@UseGuards(AuthGuard, RolesGuard)
export class DepartmentController {
  constructor(
    @Inject(SERVICES.EMPLOYEE) private readonly employeeClient: ClientProxy,
  ) { }

  @Post()
  @Roles(['admin'])
  @ApiOperation({ summary: 'Create a new department (Admin only)' })
  @ApiResponse({ status: 201, description: 'Successfully created department' })
  createDepartment(@Body() data: CreateDepartmentDto) {
    return this.employeeClient.send({ cmd: COMMANDS.DEPARTMENT.CREATE }, data);
  }

  @Get()
  @ApiOperation({ summary: 'Get list of all departments' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved list of departments' })
  getAllDepartments(@Query() query: GetDepartmentsDto) {
    return this.employeeClient.send({ cmd: COMMANDS.DEPARTMENT.GET_ALL }, query || {});
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get department details by ID' })
  @ApiParam({ name: 'id', type: 'number', description: 'The unique ID of the department' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved department details' })
  getDepartmentById(@Param() params: GetDepartmentByIdDto) {
    return this.employeeClient.send({ cmd: COMMANDS.DEPARTMENT.GET_BY_ID }, { id: params.id });
  }

  @Patch(':id')
  @Roles(['admin'])
  @ApiOperation({ summary: 'Update department by ID (Admin only)' })
  @ApiParam({ name: 'id', type: 'number', description: 'The unique ID of the department to update' })
  @ApiResponse({ status: 200, description: 'Successfully updated department' })
  updateDepartment(@Param() params: GetDepartmentByIdDto, @Body() data: UpdateDepartmentDto) {
    return this.employeeClient.send({ cmd: COMMANDS.DEPARTMENT.UPDATE }, { id: params.id, updateData: data });
  }

  @Delete(':id')
  @Roles(['admin'])
  @ApiOperation({ summary: 'Delete department by ID (Admin only)' })
  @ApiParam({ name: 'id', type: 'number', description: 'The unique ID of the department to delete' })
  @ApiResponse({ status: 200, description: 'Successfully deleted department' })
  deleteDepartment(@Param() params: GetDepartmentByIdDto) {
    return this.employeeClient.send({ cmd: COMMANDS.DEPARTMENT.DELETE }, { id: params.id });
  }
}
