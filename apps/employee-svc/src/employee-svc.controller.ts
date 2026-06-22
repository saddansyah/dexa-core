import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { COMMANDS, GetEmployeeByEmailDto, GetEmployeeByIdDto } from '@app/common';
import { EmployeeSvcService } from './employee-svc.service';

@Controller()
export class EmployeeSvcController {
  private readonly logger = new Logger(EmployeeSvcController.name);

  constructor(private readonly employeeSvcService: EmployeeSvcService) { }

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
}
