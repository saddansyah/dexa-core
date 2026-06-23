import { Controller, Get, Inject, UseGuards, Post, Body, Query, Param, Patch, Delete } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { SERVICES, COMMANDS, AuthGuard, RolesGuard, Roles, CurrentUser, CreateAttendanceDto, UpdateAttendanceDto, GetAttendancesDto, JwtPayloadDto } from '@app/common';

@Controller('attendance')
@UseGuards(AuthGuard, RolesGuard)
export class AttendanceController {
  constructor(
    @Inject(SERVICES.ATTENDANCE) private readonly attendanceClient: ClientProxy,
  ) { }

  @Post('my')
  @Roles(['admin', 'hr', 'employee'])
  createMyAttendance(@CurrentUser() user: JwtPayloadDto, @Body() data: CreateAttendanceDto) {
    const payload = { ...data, employeeId: user.employeeId };
    return this.attendanceClient.send({ cmd: COMMANDS.ATTENDANCE.CREATE }, payload);
  }

  @Get('my')
  @Roles(['admin', 'hr', 'employee'])
  getMyAttendances(@CurrentUser() user: JwtPayloadDto, @Query() query: GetAttendancesDto) {
    const payload = { ...query, employeeId: user.employeeId };
    return this.attendanceClient.send({ cmd: COMMANDS.ATTENDANCE.GET_ALL }, payload);
  }

  @Get('my/:date')
  @Roles(['admin', 'hr', 'employee'])
  getMyAttendanceById(
    @Param('date') date: string,
    @CurrentUser() user: JwtPayloadDto,
  ) {
    return this.attendanceClient.send(
      { cmd: COMMANDS.ATTENDANCE.GET_BY_ID },
      { employeeId: user.employeeId, date }
    );
  }

  @Patch('my/:date')
  @Roles(['admin', 'hr', 'employee'])
  updateMyAttendance(
    @Param('date') date: string,
    @CurrentUser() user: JwtPayloadDto,
    @Body() data: UpdateAttendanceDto,
  ) {
    return this.attendanceClient.send(
      { cmd: COMMANDS.ATTENDANCE.UPDATE },
      { employeeId: user.employeeId, date, updateData: data }
    );
  }

  @Delete('my/:date')
  @Roles(['admin', 'hr', 'employee'])
  deleteMyAttendance(
    @Param('date') date: string,
    @CurrentUser() user: JwtPayloadDto,
  ) {
    return this.attendanceClient.send(
      { cmd: COMMANDS.ATTENDANCE.DELETE },
      { employeeId: user.employeeId, date }
    );
  }

  @Get()
  @Roles(['admin', 'hr'])
  getAllAttendances(@Query() query: GetAttendancesDto) {
    return this.attendanceClient.send({ cmd: COMMANDS.ATTENDANCE.GET_ALL }, query || {});
  }

  @Get(':employeeId/:date')
  @Roles(['admin', 'hr'])
  getAttendanceById(
    @Param('employeeId') employeeId: string,
    @Param('date') date: string,
  ) {
    return this.attendanceClient.send(
      { cmd: COMMANDS.ATTENDANCE.GET_BY_ID },
      { employeeId, date }
    );
  }

  @Post()
  @Roles(['admin'])
  createAttendance(@Body() data: CreateAttendanceDto) {
    return this.attendanceClient.send({ cmd: COMMANDS.ATTENDANCE.CREATE }, data);
  }

  @Patch(':employeeId/:date')
  @Roles(['admin'])
  updateAttendance(
    @Param('employeeId') employeeId: string,
    @Param('date') date: string,
    @Body() data: UpdateAttendanceDto,
  ) {
    return this.attendanceClient.send(
      { cmd: COMMANDS.ATTENDANCE.UPDATE },
      { employeeId, date, updateData: data }
    );
  }

  @Delete(':employeeId/:date')
  @Roles(['admin'])
  deleteAttendance(
    @Param('employeeId') employeeId: string,
    @Param('date') date: string,
  ) {
    return this.attendanceClient.send(
      { cmd: COMMANDS.ATTENDANCE.DELETE },
      { employeeId, date }
    );
  }
}


