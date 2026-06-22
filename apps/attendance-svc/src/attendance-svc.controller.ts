import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { COMMANDS, CreateAttendanceDto, UpdateAttendanceDto, GetAttendancesDto, GetAttendanceByIdDto } from '@app/common';
import { AttendanceSvcService } from './attendance-svc.service';

@Controller()
export class AttendanceSvcController {
  private readonly logger = new Logger(AttendanceSvcController.name);

  constructor(private readonly attendanceSvcService: AttendanceSvcService) { }

  @MessagePattern({ cmd: COMMANDS.ATTENDANCE.GET_ALL })
  async handleGetAttendances(@Payload() data: GetAttendancesDto) {
    this.logger.log(`Received get attendances message with filters: ${JSON.stringify(data)}`);
    const result = await this.attendanceSvcService.getAll(data);
    return {
      data: result,
    };
  }

  @MessagePattern({ cmd: COMMANDS.ATTENDANCE.GET_BY_ID })
  async handleGetAttendanceById(@Payload() data: GetAttendanceByIdDto) {
    this.logger.log(`Received get attendance by ID message: ${JSON.stringify(data)}`);
    const result = await this.attendanceSvcService.getById(data.employeeId, data.date);
    return {
      data: result,
    };
  }

  @MessagePattern({ cmd: COMMANDS.ATTENDANCE.CREATE })
  async handleCreateAttendance(@Payload() data: CreateAttendanceDto) {
    this.logger.log(`Received create attendance message: ${JSON.stringify(data)}`);
    const result = await this.attendanceSvcService.create(data);
    return {
      data: result,
    };
  }

  @MessagePattern({ cmd: COMMANDS.ATTENDANCE.UPDATE })
  async handleUpdateAttendance(@Payload() data: { employeeId: string; date: string; updateData: UpdateAttendanceDto }) {
    this.logger.log(`Received update attendance message: ${JSON.stringify(data)}`);
    const result = await this.attendanceSvcService.update(data.employeeId, data.date, data.updateData);
    return {
      data: result,
    };
  }

  @MessagePattern({ cmd: COMMANDS.ATTENDANCE.DELETE })
  async handleDeleteAttendance(@Payload() data: GetAttendanceByIdDto) {
    this.logger.log(`Received delete attendance message: ${JSON.stringify(data)}`);
    const result = await this.attendanceSvcService.delete(data.employeeId, data.date);
    return {
      data: result,
    };
  }
}

