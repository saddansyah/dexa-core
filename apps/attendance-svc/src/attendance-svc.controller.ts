import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { COMMANDS } from '@app/common';
import { AttendanceSvcService } from './attendance-svc.service';

@Controller()
export class AttendanceSvcController {
  constructor(private readonly attendanceSvcService: AttendanceSvcService) {}

  @MessagePattern({ cmd: COMMANDS.ATTENDANCE.TEST })
  handleTestAttendance(@Payload() data: { message: string }) {
    console.log('Received attendance test message:', data);
    return {
      success: true,
      service: 'attendance-svc',
      receivedMessage: data.message,
      timestamp: new Date().toISOString(),
    };
  }
}
