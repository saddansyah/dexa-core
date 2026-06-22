import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { SERVICES, COMMANDS } from '@app/common';

@Controller('attendance')
export class AttendanceController {
  constructor(
    @Inject(SERVICES.ATTENDANCE) private readonly attendanceClient: ClientProxy,
  ) {}

  @Get('test')
  testAttendance() {
    return this.attendanceClient.send({ cmd: COMMANDS.ATTENDANCE.TEST }, { message: 'Ping from Gateway to Attendance' });
  }
}
