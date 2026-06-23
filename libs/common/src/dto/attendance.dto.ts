import { z } from "zod";
import { createZodDto } from "nestjs-zod";

export const CreateAttendanceSchema = z.object({
  employeeId: z.uuidv7().optional().describe("Unique ID of the employee (defaults to current user if not admin)"),
  attendanceDate: z.iso.date().optional().describe("Attendance date (defaults to today)"),
  clockInTime: z.iso.datetime().optional().describe("Clock-in time (ISO format)"),
  clockInPhoto: z.url().optional().describe("URL/reference to clock-in photo"),
  clockOutTime: z.iso.datetime().optional().describe("Clock-out time (ISO format)"),
  clockOutPhoto: z.url().optional().describe("URL/reference to clock-out photo"),
});

export class CreateAttendanceDto extends createZodDto(CreateAttendanceSchema) { }

export const UpdateAttendanceSchema = z.object({
  clockInTime: z.iso.datetime().optional().describe("Clock-in time (ISO format)"),
  clockInPhoto: z.url().optional().describe("URL/reference to clock-in photo"),
  clockOutTime: z.iso.datetime().optional().describe("Clock-out time (ISO format)"),
  clockOutPhoto: z.url().optional().describe("URL/reference to clock-out photo"),
});

export class UpdateAttendanceDto extends createZodDto(UpdateAttendanceSchema) { }

export const GetAttendancesSchema = z.object({
  employeeId: z.uuidv7().optional().describe("Filter by employee ID"),
  startDate: z.iso.datetime().optional().describe("Start date filter in ISO 8601"),
  endDate: z.iso.datetime().optional().describe("End date filter in ISO 8601"),
  limit: z.coerce.number().min(1).max(100).optional().default(10).describe("Max records to return per page"),
  page: z.coerce.number().min(1).optional().default(1).describe("Page number (1-indexed)"),
});

export class GetAttendancesDto extends createZodDto(GetAttendancesSchema) { }

export const GetAttendanceByIdSchema = z.object({
  employeeId: z.uuidv7().describe("Unique ID of the employee"),
  date: z.iso.date().describe("Attendance date (YYYY-MM-DD)"),
});

export class GetAttendanceByIdDto extends createZodDto(GetAttendanceByIdSchema) { }

export const ClockInSchema = z.object({
  photo: z.url().describe("Clock-in photo URL"),
});

export class ClockInDto extends createZodDto(ClockInSchema) { }

export const ClockOutSchema = z.object({
  photo: z.url().describe("Clock-out photo URL"),
});

export class ClockOutDto extends createZodDto(ClockOutSchema) { }
