import { Controller, Get, Inject, UseGuards, Post, Body, Query, Param, Patch, Delete } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { SERVICES, COMMANDS, AuthGuard, RolesGuard, Roles, CreateDepartmentDto, UpdateDepartmentDto, GetDepartmentsDto, GetDepartmentByIdDto } from '@app/common';

@Controller('department')
@UseGuards(AuthGuard, RolesGuard)
export class DepartmentController {
  constructor(
    @Inject(SERVICES.EMPLOYEE) private readonly employeeClient: ClientProxy,
  ) { }

  @Post()
  @Roles(['admin'])
  createDepartment(@Body() data: CreateDepartmentDto) {
    return this.employeeClient.send({ cmd: COMMANDS.DEPARTMENT.CREATE }, data);
  }

  @Get()
  getAllDepartments(@Query() query: GetDepartmentsDto) {
    return this.employeeClient.send({ cmd: COMMANDS.DEPARTMENT.GET_ALL }, query || {});
  }

  @Get(':id')
  getDepartmentById(@Param() params: GetDepartmentByIdDto) {
    return this.employeeClient.send({ cmd: COMMANDS.DEPARTMENT.GET_BY_ID }, { id: params.id });
  }

  @Patch(':id')
  @Roles(['admin'])
  updateDepartment(@Param() params: GetDepartmentByIdDto, @Body() data: UpdateDepartmentDto) {
    return this.employeeClient.send({ cmd: COMMANDS.DEPARTMENT.UPDATE }, { id: params.id, updateData: data });
  }

  @Delete(':id')
  @Roles(['admin'])
  deleteDepartment(@Param() params: GetDepartmentByIdDto) {
    return this.employeeClient.send({ cmd: COMMANDS.DEPARTMENT.DELETE }, { id: params.id });
  }
}
