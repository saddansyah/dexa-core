import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { COMMANDS, GetEmployeeByEmailDto, GetEmployeeByIdDto, CreateEmployeeDto, UpdateEmployeeDto, GetEmployeesDto, CreateDepartmentDto, UpdateDepartmentDto, GetDepartmentsDto, GetDepartmentByIdDto } from '@app/common';
import { EmployeeSvcService } from './employee-svc.service';

@Controller()
export class EmployeeSvcController {
  private readonly logger = new Logger(EmployeeSvcController.name);

  constructor(private readonly employeeSvcService: EmployeeSvcService) { }

  @MessagePattern({ cmd: COMMANDS.EMPLOYEE.GET_ALL })
  async handleGetEmployees(@Payload() filters: GetEmployeesDto) {
    this.logger.log(`Received get employees list message with filters: ${JSON.stringify(filters)}`);
    const { data, meta } = await this.employeeSvcService.getAll(filters);
    return {
      data,
      meta
    };
  }

  @MessagePattern({ cmd: COMMANDS.EMPLOYEE.GET_BY_EMAIL })
  async handleGetEmployeeByEmail(@Payload() data: GetEmployeeByEmailDto) {
    this.logger.log(`Received get employee by email message: ${JSON.stringify(data)}`);
    const employee = await this.employeeSvcService.getByEmail(data.email);
    return {
      data: employee,
    };
  }

  @MessagePattern({ cmd: COMMANDS.EMPLOYEE.GET_BY_ID })
  async handleGetEmployeeById(@Payload() data: GetEmployeeByIdDto) {
    this.logger.log(`Received get employee by id message: ${JSON.stringify(data)}`);
    const employee = await this.employeeSvcService.getById(data.id);
    return {
      data: employee,
    };
  }

  @MessagePattern({ cmd: COMMANDS.EMPLOYEE.CREATE })
  async handleCreateEmployee(@Payload() data: CreateEmployeeDto) {
    this.logger.log(`Received create employee message for: ${data.email}`);
    const employee = await this.employeeSvcService.create(data);
    return {
      data: employee,
    };
  }

  @MessagePattern({ cmd: COMMANDS.EMPLOYEE.UPDATE })
  async handleUpdateEmployee(@Payload() data: { id: string; updateData: UpdateEmployeeDto }) {
    this.logger.log(`Received update employee message for ID: ${data.id}`);
    const employee = await this.employeeSvcService.update(data.id, data.updateData);
    return {
      data: employee,
    };
  }

  @MessagePattern({ cmd: COMMANDS.EMPLOYEE.DELETE })
  async handleDeleteEmployee(@Payload() data: GetEmployeeByIdDto) {
    this.logger.log(`Received delete employee message for ID: ${data.id}`);
    const result = await this.employeeSvcService.delete(data.id);
    return {
      data: result,
    };
  }

  @MessagePattern({ cmd: COMMANDS.DEPARTMENT.GET_ALL })
  async handleGetDepartments(@Payload() filters: GetDepartmentsDto) {
    this.logger.log(`Received get departments list message with filters: ${JSON.stringify(filters)}`);
    const { data, meta } = await this.employeeSvcService.getAllDepartments(filters);
    return {
      data,
      meta
    };
  }

  @MessagePattern({ cmd: COMMANDS.DEPARTMENT.GET_BY_ID })
  async handleGetDepartmentById(@Payload() data: GetDepartmentByIdDto) {
    this.logger.log(`Received get department by id message: ${JSON.stringify(data)}`);
    const department = await this.employeeSvcService.getDepartmentById(data.id);
    return {
      data: department,
    };
  }

  @MessagePattern({ cmd: COMMANDS.DEPARTMENT.CREATE })
  async handleCreateDepartment(@Payload() data: CreateDepartmentDto) {
    this.logger.log(`Received create department message: ${JSON.stringify(data)}`);
    const department = await this.employeeSvcService.createDepartment(data);
    return {
      data: department,
    };
  }

  @MessagePattern({ cmd: COMMANDS.DEPARTMENT.UPDATE })
  async handleUpdateDepartment(@Payload() data: { id: number; updateData: UpdateDepartmentDto }) {
    this.logger.log(`Received update department message for ID: ${data.id}`);
    const department = await this.employeeSvcService.updateDepartment(data.id, data.updateData);
    return {
      data: department,
    };
  }

  @MessagePattern({ cmd: COMMANDS.DEPARTMENT.DELETE })
  async handleDeleteDepartment(@Payload() data: GetDepartmentByIdDto) {
    this.logger.log(`Received delete department message for ID: ${data.id}`);
    const result = await this.employeeSvcService.deleteDepartment(data.id);
    return {
      data: result,
    };
  }

  @MessagePattern({ cmd: 'ping' })
  handlePing() {
    return { status: 'ok' };
  }
}

