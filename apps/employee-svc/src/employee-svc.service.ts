import { Inject, Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { DRIZZLE_MODULE_PROVIDER, employees, users } from '@app/database';
import { MySql2Database } from 'drizzle-orm/mysql2';
import * as dbSchema from '@app/database';
import { eq, and, desc, count } from 'drizzle-orm';
import { CreateEmployeeDto, UpdateEmployeeDto, GetEmployeesDto, hashPassword } from '@app/common';
import { v7 as uuidv7 } from 'uuid';

@Injectable()
export class EmployeeSvcService {
  constructor(
    @Inject(DRIZZLE_MODULE_PROVIDER)
    private readonly db: MySql2Database<typeof dbSchema>,
  ) { }

  async getAll(filters?: GetEmployeesDto) {
    const page = filters?.page ?? 1;
    const limit = filters?.limit ?? 10;
    const offset = (page - 1) * limit;

    const conditions: any[] = [];
    if (filters?.departmentId) {
      conditions.push(eq(employees.departmentId, filters.departmentId));
    }
    if (filters?.status) {
      conditions.push(eq(employees.status, filters.status));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // 1. Query total count
    let countQuery = this.db
      .select({ value: count() })
      .from(employees)
      .innerJoin(users, eq(employees.userId, users.id))
      .$dynamic();

    if (whereClause) {
      countQuery = countQuery.where(whereClause);
    }
    const [countResult] = await countQuery;
    const total = countResult?.value ?? 0;

    // 2. Query paginated list
    let listQuery = this.db
      .select({
        id: employees.id,
        name: employees.name,
        address: employees.address,
        dob: employees.dob,
        position: employees.position,
        joinDate: employees.joinDate,
        resignDate: employees.resignDate,
        status: employees.status,
        createdAt: employees.createdAt,
        updatedAt: employees.updatedAt,
        user: {
          id: users.id,
          email: users.email,
          roleId: users.roleId,
        },
      })
      .from(employees)
      .innerJoin(users, eq(employees.userId, users.id))
      .orderBy(desc(employees.id))
      .limit(limit)
      .offset(offset)
      .$dynamic();

    if (whereClause) {
      listQuery = listQuery.where(whereClause);
    }

    const employeesList = await listQuery;
    const totalPages = Math.ceil(total / limit);

    return {
      data: employeesList,
      meta: {
        total,
        page,
        limit,
        totalPages,
      },
    };
  }

  async getById(id: string) {
    const result = await this.db.select({
      id: employees.id,
      name: employees.name,
      address: employees.address,
      dob: employees.dob,
      position: employees.position,
      joinDate: employees.joinDate,
      resignDate: employees.resignDate,
      status: employees.status,
      createdAt: employees.createdAt,
      updatedAt: employees.updatedAt,
      user: {
        id: users.id,
        email: users.email,
        roleId: users.roleId,
      },
    })
      .from(employees)
      .innerJoin(users, eq(employees.userId, users.id))
      .where(eq(employees.id, id));

    if (!result[0]) throw new NotFoundException('Employee not found');

    return result[0];
  }

  async getByEmail(email: string) {
    const result = await this.db
      .select({
        id: employees.id,
        name: employees.name,
        address: employees.address,
        dob: employees.dob,
        position: employees.position,
        joinDate: employees.joinDate,
        resignDate: employees.resignDate,
        status: employees.status,
        createdAt: employees.createdAt,
        updatedAt: employees.updatedAt,
        user: {
          id: users.id,
          email: users.email,
          roleId: users.roleId,
        },
      })
      .from(employees)
      .innerJoin(users, eq(employees.userId, users.id))
      .where(eq(users.email, email));

    if (!result[0]) throw new NotFoundException('Employee not found');

    return result[0];
  }

  async create(data: CreateEmployeeDto) {
    const { email, password, name, dob, roleId, departmentId, address, position, status, joinDate } = data;

    // Check if user already exists
    const existingUser = await this.db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser[0]) {
      throw new ConflictException('Email already in use');
    }

    const hashedPassword = await hashPassword(password);
    const userId = uuidv7();
    const employeeId = uuidv7();

    await this.db.transaction(async (tx) => {
      await tx.insert(users).values({
        id: userId,
        email,
        password: hashedPassword,
        roleId,
      });

      await tx.insert(employees).values({
        id: employeeId,
        userId,
        name,
        dob: new Date(dob),
        departmentId: departmentId ?? null,
        address: address ?? null,
        position: position ?? null,
        status: status ?? 'contract',
        joinDate: joinDate ? new Date(joinDate) : new Date(),
      });
    });

    return this.getById(employeeId);
  }

  async update(id: string, data: UpdateEmployeeDto) {
    const employeeResult = await this.db
      .select()
      .from(employees)
      .where(eq(employees.id, id))
      .limit(1);

    const employee = employeeResult[0];
    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    const { email, roleId, name, dob, departmentId, address, position, status, joinDate, resignDate } = data;

    await this.db.transaction(async (tx) => {
      if (email || roleId) {
        if (email) {
          const userResult = await tx.select().from(users).where(eq(users.id, employee.userId!)).limit(1);
          const currentUser = userResult[0];
          if (currentUser && currentUser.email !== email) {
            const emailInUse = await tx.select().from(users).where(eq(users.email, email)).limit(1);
            if (emailInUse[0]) {
              throw new ConflictException('Email already in use');
            }
          }
        }

        const userUpdateData: Partial<typeof users.$inferInsert> = {};
        if (email) userUpdateData.email = email;
        if (roleId) userUpdateData.roleId = roleId;

        await tx.update(users).set(userUpdateData).where(eq(users.id, employee.userId!));
      }

      const employeeUpdateData: Partial<typeof employees.$inferInsert> = {};
      if (name !== undefined) employeeUpdateData.name = name;
      if (address !== undefined) employeeUpdateData.address = address;
      if (dob !== undefined) employeeUpdateData.dob = dob ? new Date(dob) : undefined;
      if (position !== undefined) employeeUpdateData.position = position;
      if (status !== undefined) employeeUpdateData.status = status;
      if (departmentId !== undefined) employeeUpdateData.departmentId = departmentId;
      if (joinDate !== undefined) employeeUpdateData.joinDate = joinDate ? new Date(joinDate) : undefined;
      if (resignDate !== undefined) employeeUpdateData.resignDate = resignDate ? new Date(resignDate) : null;

      if (Object.keys(employeeUpdateData).length > 0) {
        await tx.update(employees).set(employeeUpdateData).where(eq(employees.id, id));
      }
    });

    return this.getById(id);
  }

  async delete(id: string) {
    const employeeResult = await this.db
      .select()
      .from(employees)
      .where(eq(employees.id, id))
      .limit(1);

    const employee = employeeResult[0];
    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    await this.db.delete(users).where(eq(users.id, employee.userId!));

    return { success: true };
  }
}

