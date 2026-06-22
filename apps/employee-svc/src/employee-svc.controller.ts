import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { COMMANDS, GetEmployeeByEmailDto, GetEmployeeByIdDto, CreateEmployeeDto, UpdateEmployeeDto, GetEmployeesDto } from '@app/common';
import { EmployeeSvcService } from './employee-svc.service';

@Controller()
export class EmployeeSvcController {
  private readonly logger = new Logger(EmployeeSvcController.name);

  constructor(private readonly employeeSvcService: EmployeeSvcService) { }

  @MessagePattern({ cmd: COMMANDS.EMPLOYEE.GET_ALL })
  async handleGetEmployees(@Payload() data: GetEmployeesDto) {
    this.logger.log(`Received get employees list message with filters: ${JSON.stringify(data)}`);
    const employees = await this.employeeSvcService.getAll(data);
    return {
      data: employees,
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
}

