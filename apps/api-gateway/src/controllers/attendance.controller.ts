import { Controller, Get, Inject, UseGuards, Post, Body, Query, Param, Patch, Delete, ForbiddenException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { SERVICES, COMMANDS, AuthGuard, RolesGuard, Roles, CurrentUser, CreateAttendanceDto, UpdateAttendanceDto, GetAttendancesDto } from '@app/common';

@Controller('attendance')
@UseGuards(AuthGuard, RolesGuard)
export class AttendanceController {
  constructor(
    @Inject(SERVICES.ATTENDANCE) private readonly attendanceClient: ClientProxy,
  ) { }

  @Post()
  @Roles(['admin', 'hr', 'employee'])
  createAttendance(@CurrentUser() user: any, @Body() data: CreateAttendanceDto) {
    const payload = { ...data };
    if (user.role !== 'admin') {
      payload.employeeId = user.employeeId;
    }
    return this.attendanceClient.send({ cmd: COMMANDS.ATTENDANCE.CREATE }, payload);
  }

  @Get()
  @Roles(['admin', 'hr', 'employee'])
  getAttendances(@CurrentUser() user: any, @Query() query: GetAttendancesDto) {
    const payload = { ...query };
    if (user.role === 'employee') {
      payload.employeeId = user.employeeId;
    }
    return this.attendanceClient.send({ cmd: COMMANDS.ATTENDANCE.GET_ALL }, payload);
  }

  @Get(':employeeId/:date')
  @Roles(['admin', 'hr', 'employee'])
  getAttendanceById(
    @Param('employeeId') employeeId: string,
    @Param('date') date: string,
    @CurrentUser() user: any,
  ) {
    if (user.role === 'employee' && employeeId !== user.employeeId) {
      throw new ForbiddenException('You can only view your own attendance');
    }
    return this.attendanceClient.send(
      { cmd: COMMANDS.ATTENDANCE.GET_BY_ID },
      { employeeId, date }
    );
  }

  @Patch(':employeeId/:date')
  @Roles(['admin', 'hr', 'employee'])
  updateAttendance(
    @Param('employeeId') employeeId: string,
    @Param('date') date: string,
    @CurrentUser() user: any,
    @Body() data: UpdateAttendanceDto,
  ) {
    if (user.role !== 'admin' && employeeId !== user.employeeId) {
      throw new ForbiddenException('You can only update your own attendance');
    }
    return this.attendanceClient.send(
      { cmd: COMMANDS.ATTENDANCE.UPDATE },
      { employeeId, date, updateData: data }
    );
  }

  @Delete(':employeeId/:date')
  @Roles(['admin', 'hr', 'employee'])
  deleteAttendance(
    @Param('employeeId') employeeId: string,
    @Param('date') date: string,
    @CurrentUser() user: any,
  ) {
    if (user.role !== 'admin' && employeeId !== user.employeeId) {
      throw new ForbiddenException('You can only delete your own attendance');
    }
    return this.attendanceClient.send(
      { cmd: COMMANDS.ATTENDANCE.DELETE },
      { employeeId, date }
    );
  }
}

