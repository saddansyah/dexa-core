import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { COMMANDS } from '@app/common';
import { AttendanceSvcService } from './attendance-svc.service';

@Controller()
export class AttendanceSvcController {
  constructor(private readonly attendanceSvcService: AttendanceSvcService) { }

}
