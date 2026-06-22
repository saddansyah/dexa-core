import { Inject, Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { DRIZZLE_MODULE_PROVIDER, attendances, employees } from '@app/database';
import { MySql2Database } from 'drizzle-orm/mysql2';
import * as dbSchema from '@app/database';
import { eq, and, gte, lte, desc, count } from 'drizzle-orm';
import { CreateAttendanceDto, UpdateAttendanceDto, GetAttendancesDto } from '@app/common';

@Injectable()
export class AttendanceSvcService {
  constructor(
    @Inject(DRIZZLE_MODULE_PROVIDER)
    private readonly db: MySql2Database<typeof dbSchema>,
  ) { }

  async getAll(filters?: GetAttendancesDto) {
    const page = filters?.page ?? 1;
    const limit = filters?.limit ?? 10;
    const offset = (page - 1) * limit;

    const conditions: any[] = [];
    if (filters?.employeeId) {
      conditions.push(eq(attendances.employeeId, filters.employeeId));
    }
    if (filters?.startDate) {
      conditions.push(gte(attendances.attendanceDate, new Date(filters.startDate)));
    }
    if (filters?.endDate) {
      conditions.push(lte(attendances.attendanceDate, new Date(filters.endDate)));
    }
    if (filters?.status) {
      conditions.push(eq(attendances.status, filters.status));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    let countQuery = this.db
      .select({ value: count() })
      .from(attendances)
      .leftJoin(employees, eq(attendances.employeeId, employees.id))
      .$dynamic();

    if (whereClause) {
      countQuery = countQuery.where(whereClause);
    }
    const [countResult] = await countQuery;
    const total = countResult?.value ?? 0;

    let listQuery = this.db
      .select({
        employeeId: attendances.employeeId,
        attendanceDate: attendances.attendanceDate,
        clockInTime: attendances.clockInTime,
        clockInPhoto: attendances.clockInPhoto,
        clockOutTime: attendances.clockOutTime,
        clockOutPhoto: attendances.clockOutPhoto,
        status: attendances.status,
        createdAt: attendances.createdAt,
        updatedAt: attendances.updatedAt,
        employeeName: employees.name,
      })
      .from(attendances)
      .leftJoin(employees, eq(attendances.employeeId, employees.id))
      .orderBy(desc(attendances.attendanceDate))
      .limit(limit)
      .offset(offset)
      .$dynamic();

    if (whereClause) {
      listQuery = listQuery.where(whereClause);
    }

    const attendancesList = await listQuery;
    const totalPages = Math.ceil(total / limit);

    return {
      data: attendancesList,
      meta: {
        total,
        page,
        limit,
        totalPages,
      },
    };
  }

  async getById(employeeId: string, date: string) {
    const result = await this.db
      .select()
      .from(attendances)
      .where(
        and(
          eq(attendances.employeeId, employeeId),
          eq(attendances.attendanceDate, new Date(date))
        )
      )
      .limit(1);

    if (!result[0]) {
      throw new NotFoundException('Attendance record not found');
    }

    return result[0];
  }

  async create(data: CreateAttendanceDto) {
    // 1. Check if employee exists
    const employee = await this.db
      .select()
      .from(employees)
      .where(eq(employees.id, data.employeeId!))
      .limit(1);

    if (!employee[0]) {
      throw new NotFoundException('Employee not found');
    }

    // 2. Validate composite key (employeeId + date)
    const dateVal = data.attendanceDate ? new Date(data.attendanceDate) : new Date();
    const dateStr = data.attendanceDate || dateVal.toISOString().split('T')[0];
    const attendanceDateVal = new Date(dateStr);

    const existing = await this.db
      .select()
      .from(attendances)
      .where(
        and(
          eq(attendances.employeeId, data.employeeId!),
          eq(attendances.attendanceDate, attendanceDateVal)
        )
      )
      .limit(1);

    if (existing[0]) {
      throw new ConflictException('Attendance record for this employee and date already exists');
    }

    // 3. Status calculation
    let calculatedStatus: 'present' | 'late' | 'absent' | 'incomplete' = 'present';
    if (data.status) {
      calculatedStatus = data.status;
    } else if (data.clockInTime) {
      const clockIn = new Date(data.clockInTime);
      const hours = clockIn.getUTCHours();
      const minutes = clockIn.getUTCMinutes();
      if (hours > 8 || (hours === 8 && minutes > 30)) {
        calculatedStatus = 'late';
      } else {
        calculatedStatus = 'present';
      }
    } else {
      calculatedStatus = 'incomplete';
    }

    const insertData = {
      employeeId: data.employeeId!,
      attendanceDate: attendanceDateVal,
      clockInTime: data.clockInTime ? new Date(data.clockInTime) : null,
      clockInPhoto: data.clockInPhoto ?? null,
      clockOutTime: data.clockOutTime ? new Date(data.clockOutTime) : null,
      clockOutPhoto: data.clockOutPhoto ?? null,
      status: calculatedStatus,
    };

    await this.db.insert(attendances).values(insertData);

    return this.getById(data.employeeId!, dateStr);
  }

  async update(employeeId: string, date: string, data: UpdateAttendanceDto) {
    const existingResult = await this.db
      .select()
      .from(attendances)
      .where(
        and(
          eq(attendances.employeeId, employeeId),
          eq(attendances.attendanceDate, new Date(date))
        )
      )
      .limit(1);

    const existing = existingResult[0];
    if (!existing) {
      throw new NotFoundException('Attendance record not found');
    }

    const updateData: Partial<typeof attendances.$inferInsert> = {};
    if (data.clockInTime !== undefined) updateData.clockInTime = data.clockInTime ? new Date(data.clockInTime) : null;
    if (data.clockInPhoto !== undefined) updateData.clockInPhoto = data.clockInPhoto;
    if (data.clockOutTime !== undefined) updateData.clockOutTime = data.clockOutTime ? new Date(data.clockOutTime) : null;
    if (data.clockOutPhoto !== undefined) updateData.clockOutPhoto = data.clockOutPhoto;

    if (data.status !== undefined) {
      updateData.status = data.status;
    } else if (data.clockOutTime && existing.status === 'incomplete') {
      const clockIn = existing.clockInTime;
      if (clockIn) {
        const hours = clockIn.getUTCHours();
        const minutes = clockIn.getUTCMinutes();
        if (hours > 8 || (hours === 8 && minutes > 30)) {
          updateData.status = 'late';
        } else {
          updateData.status = 'present';
        }
      } else {
        updateData.status = 'present';
      }
    }

    if (Object.keys(updateData).length > 0) {
      await this.db
        .update(attendances)
        .set(updateData)
        .where(
          and(
            eq(attendances.employeeId, employeeId),
            eq(attendances.attendanceDate, new Date(date))
          )
        );
    }

    return this.getById(employeeId, date);
  }

  async delete(employeeId: string, date: string) {
    const existing = await this.db
      .select()
      .from(attendances)
      .where(
        and(
          eq(attendances.employeeId, employeeId),
          eq(attendances.attendanceDate, new Date(date))
        )
      )
      .limit(1);

    if (!existing[0]) {
      throw new NotFoundException('Attendance record not found');
    }

    await this.db
      .delete(attendances)
      .where(
        and(
          eq(attendances.employeeId, employeeId),
          eq(attendances.attendanceDate, new Date(date))
        )
      );

    return { success: true };
  }
}
