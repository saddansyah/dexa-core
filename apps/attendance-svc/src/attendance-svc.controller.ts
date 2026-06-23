import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { COMMANDS, CreateAttendanceDto, UpdateAttendanceDto, GetAttendancesDto, GetAttendanceByIdDto } from '@app/common';
import { AttendanceSvcService } from './attendance-svc.service';

@Controller()
export class AttendanceSvcController {
  private readonly logger = new Logger(AttendanceSvcController.name);

  constructor(private readonly attendanceSvcService: AttendanceSvcService) { }

  @MessagePattern({ cmd: COMMANDS.ATTENDANCE.GET_ALL })
  async handleGetAttendances(@Payload() filters: GetAttendancesDto) {
    this.logger.log(`Received get attendances message with filters: ${JSON.stringify(filters)}`);
    const { data, meta } = await this.attendanceSvcService.getAll(filters);
    return {
      data, meta
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

  @MessagePattern({ cmd: COMMANDS.ATTENDANCE.CLOCK_IN })
  async handleClockIn(@Payload() data: { employeeId: string; clockInPhoto: string }) {
    this.logger.log(`Received clock-in message: ${JSON.stringify(data)}`);
    const result = await this.attendanceSvcService.clockIn(data.employeeId, data.clockInPhoto);
    return {
      data: result,
    };
  }

  @MessagePattern({ cmd: COMMANDS.ATTENDANCE.CLOCK_OUT })
  async handleClockOut(@Payload() data: { employeeId: string; clockOutPhoto: string }) {
    this.logger.log(`Received clock-out message: ${JSON.stringify(data)}`);
    const result = await this.attendanceSvcService.clockOut(data.employeeId, data.clockOutPhoto);
    return {
      data: result,
    };
  }
}

