import { Controller, Get, Inject, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { SERVICES, COMMANDS, AuthGuard } from '@app/common';

@Controller('attendance')
@UseGuards(AuthGuard)
export class AttendanceController {
  constructor(
    @Inject(SERVICES.ATTENDANCE) private readonly attendanceClient: ClientProxy,
  ) { }
}
