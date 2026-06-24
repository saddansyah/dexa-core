import { Controller, Get, Inject, UseGuards, Post, Body, Query, Param, Patch, Delete } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import {
  SERVICES,
  COMMANDS,
  AuthGuard,
  RolesGuard,
  Roles,
  CurrentUser,
  CreateAttendanceDto,
  UpdateAttendanceDto,
  GetAttendancesDto,
  JwtPayloadDto,
  ClockInDto,
  ClockOutDto,
  ApiOkResponseStandard,
  ApiOkResponseStandardArray,
  ApiCreatedResponseStandard,
  AttendanceResponseDto,
  SuccessResponseDto,
} from '@app/common';

@ApiTags('Attendance')
@Controller('attendance')
@UseGuards(AuthGuard, RolesGuard)
export class AttendanceController {
  constructor(
    @Inject(SERVICES.ATTENDANCE) private readonly attendanceClient: ClientProxy,
  ) { }

  @Post('clock-in')
  @ApiOperation({ summary: 'Clock in for the day' })
  @ApiCreatedResponseStandard(AttendanceResponseDto)
  clockIn(@CurrentUser() user: JwtPayloadDto, @Body() data: ClockInDto) {
    return this.attendanceClient.send(
      { cmd: COMMANDS.ATTENDANCE.CLOCK_IN },
      { employeeId: user.employeeId, clockInPhoto: data.photo }
    );
  }

  @Post('clock-out')
  @ApiOperation({ summary: 'Clock out for the day' })
  @ApiOkResponseStandard(AttendanceResponseDto)
  clockOut(@CurrentUser() user: JwtPayloadDto, @Body() data: ClockOutDto) {
    return this.attendanceClient.send(
      { cmd: COMMANDS.ATTENDANCE.CLOCK_OUT },
      { employeeId: user.employeeId, clockOutPhoto: data.photo }
    );
  }

  @Get('my')
  @ApiOperation({ summary: 'Get list of current user\'s attendance records' })
  @ApiOkResponseStandardArray(AttendanceResponseDto)
  getMyAttendances(@CurrentUser() user: JwtPayloadDto, @Query() query: GetAttendancesDto) {
    const payload = { ...query, employeeId: user.employeeId };
    return this.attendanceClient.send({ cmd: COMMANDS.ATTENDANCE.GET_ALL }, payload);
  }

  @Get('my/:date')
  @ApiOperation({ summary: 'Get current user\'s attendance record for a specific date' })
  @ApiParam({ name: 'date', type: 'string', description: 'Attendance date (YYYY-MM-DD)' })
  @ApiOkResponseStandard(AttendanceResponseDto)
  getMyAttendanceById(
    @Param('date') date: string,
    @CurrentUser() user: JwtPayloadDto,
  ) {
    return this.attendanceClient.send(
      { cmd: COMMANDS.ATTENDANCE.GET_BY_ID },
      { employeeId: user.employeeId, date }
    );
  }

  @Get()
  @Roles(['admin', 'hr'])
  @ApiOperation({ summary: 'Get all attendance records (Admin/HR only)' })
  @ApiOkResponseStandardArray(AttendanceResponseDto)
  getAllAttendances(@Query() query: GetAttendancesDto) {
    return this.attendanceClient.send({ cmd: COMMANDS.ATTENDANCE.GET_ALL }, query || {});
  }

  @Get(':employeeId/:date')
  @Roles(['admin', 'hr'])
  @ApiOperation({ summary: 'Get specific attendance record by employee ID and date (Admin/HR only)' })
  @ApiParam({ name: 'employeeId', type: 'string', description: 'Unique ID of the employee' })
  @ApiParam({ name: 'date', type: 'string', description: 'Attendance date (YYYY-MM-DD)' })
  @ApiOkResponseStandard(AttendanceResponseDto)
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
  @ApiOperation({ summary: 'Create a new attendance record manually (Admin only)' })
  @ApiCreatedResponseStandard(AttendanceResponseDto)
  createAttendance(@Body() data: CreateAttendanceDto) {
    return this.attendanceClient.send({ cmd: COMMANDS.ATTENDANCE.CREATE }, data);
  }

  @Patch(':employeeId/:date')
  @Roles(['admin'])
  @ApiOperation({ summary: 'Update specific attendance record (Admin only)' })
  @ApiParam({ name: 'employeeId', type: 'string', description: 'Unique ID of the employee' })
  @ApiParam({ name: 'date', type: 'string', description: 'Attendance date (YYYY-MM-DD)' })
  @ApiOkResponseStandard(AttendanceResponseDto)
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
  @ApiOperation({ summary: 'Delete specific attendance record (Admin only)' })
  @ApiParam({ name: 'employeeId', type: 'string', description: 'Unique ID of the employee' })
  @ApiParam({ name: 'date', type: 'string', description: 'Attendance date (YYYY-MM-DD)' })
  @ApiOkResponseStandard(SuccessResponseDto)
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


