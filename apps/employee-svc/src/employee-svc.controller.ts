import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { COMMANDS } from '@app/common';
import { EmployeeSvcService } from './employee-svc.service';

@Controller()
export class EmployeeSvcController {
  constructor(private readonly employeeSvcService: EmployeeSvcService) {}

  @MessagePattern({ cmd: COMMANDS.EMPLOYEE.TEST })
  handleTestEmployee(@Payload() data: { message: string }) {
    console.log('Received employee test message:', data);
    return {
      success: true,
      service: 'employee-svc',
      receivedMessage: data.message,
      timestamp: new Date().toISOString(),
    };
  }
}
