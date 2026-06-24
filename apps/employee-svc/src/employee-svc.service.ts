import { Inject, Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { DRIZZLE_MODULE_PROVIDER, employees, users, departments } from '@app/database';
import { MySql2Database } from 'drizzle-orm/mysql2';
import * as dbSchema from '@app/database';
import { eq, and, desc, count, or } from 'drizzle-orm';
import { CreateEmployeeDto, UpdateEmployeeDto, GetEmployeesDto, hashPassword, CreateDepartmentDto, UpdateDepartmentDto, GetDepartmentsDto } from '@app/common';
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
        department: {
          id: departments.id,
          name: departments.name,
          description: departments.description,
        },
      })
      .from(employees)
      .innerJoin(users, eq(employees.userId, users.id))
      .leftJoin(departments, eq(employees.departmentId, departments.id))
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
      department: {
        id: departments.id,
        name: departments.name,
        description: departments.description,
      },
    })
      .from(employees)
      .innerJoin(users, eq(employees.userId, users.id))
      .leftJoin(departments, eq(employees.departmentId, departments.id))
      .where(or(eq(employees.id, id), eq(employees.userId, id)));

    if (result[0]) {
      return result[0];
    }

    // Fallback: Check if the user exists directly in the users table (e.g. Admin user without employee record)
    const userResult = await this.db.select({
      id: users.id,
      email: users.email,
      roleId: users.roleId,
    })
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    if (!userResult[0]) {
      throw new NotFoundException('Employee or User not found');
    }

    return {
      id: null,
      name: 'Admin',
      address: null,
      dob: null,
      position: null,
      joinDate: null,
      resignDate: null,
      status: null,
      user: userResult[0],
    };
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
        department: {
          id: departments.id,
          name: departments.name,
          description: departments.description,
        },
      })
      .from(employees)
      .innerJoin(users, eq(employees.userId, users.id))
      .leftJoin(departments, eq(employees.departmentId, departments.id))
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
        dob,
        departmentId: departmentId ?? null,
        address: address ?? null,
        position: position ?? null,
        status: status ?? 'contract',
        joinDate: joinDate ?? new Date().toISOString().split('T')[0],
      });
    });

    return this.getById(employeeId);
  }

  async update(id: string, data: UpdateEmployeeDto) {
    const employee = await this.getById(id)

    const { roleId, name, dob, departmentId, address, position, status, joinDate, resignDate } = data;

    await this.db.transaction(async (tx) => {
      const userUpdateData: Partial<typeof users.$inferInsert> = {};
      if (roleId) userUpdateData.roleId = roleId;

      if (Object.keys(userUpdateData).length > 0) {
        await tx.update(users).set(userUpdateData).where(eq(users.id, employee.user.id));
      }

      const employeeUpdateData: Partial<typeof employees.$inferInsert> = {};
      if (name !== undefined) employeeUpdateData.name = name;
      if (address !== undefined) employeeUpdateData.address = address;
      if (dob !== undefined) employeeUpdateData.dob = dob;
      if (position !== undefined) employeeUpdateData.position = position;
      if (status !== undefined) employeeUpdateData.status = status;
      if (departmentId !== undefined) employeeUpdateData.departmentId = departmentId;
      if (joinDate !== undefined) employeeUpdateData.joinDate = joinDate;
      if (resignDate !== undefined) employeeUpdateData.resignDate = resignDate ?? null;

      if (Object.keys(employeeUpdateData).length > 0) {
        await tx.update(employees).set(employeeUpdateData).where(eq(employees.id, id));
      }
    });

    return this.getById(id);
  }

  async delete(id: string) {
    const employee = await this.getById(id);

    await this.db.delete(users).where(eq(users.id, employee.user.id));

    return { success: true };
  }

  async getAllDepartments(filters?: GetDepartmentsDto) {
    const page = filters?.page ?? 1;
    const limit = filters?.limit ?? 10;
    const offset = (page - 1) * limit;

    const [countResult] = await this.db
      .select({ value: count() })
      .from(departments);
    const total = countResult?.value ?? 0;

    const departmentsList = await this.db
      .select()
      .from(departments)
      .orderBy(desc(departments.id))
      .limit(limit)
      .offset(offset);

    const totalPages = Math.ceil(total / limit);

    return {
      data: departmentsList,
      meta: {
        total,
        page,
        limit,
        totalPages,
      },
    };
  }

  async getDepartmentById(id: number) {
    const result = await this.db
      .select()
      .from(departments)
      .where(eq(departments.id, id))
      .limit(1);

    if (!result[0]) {
      throw new NotFoundException('Department not found');
    }
    return result[0];
  }

  async createDepartment(data: CreateDepartmentDto) {
    const [insertResult] = await this.db.insert(departments).values({
      name: data.name,
      description: data.description ?? null,
    });
    const insertId = insertResult.insertId;
    return this.getDepartmentById(insertId);
  }

  async updateDepartment(id: number, data: UpdateDepartmentDto) {
    await this.getDepartmentById(id); // Throws if not found

    const updateData: Partial<typeof departments.$inferInsert> = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;

    if (Object.keys(updateData).length > 0) {
      await this.db.update(departments).set(updateData).where(eq(departments.id, id));
    }

    return this.getDepartmentById(id);
  }

  async deleteDepartment(id: number) {
    await this.getDepartmentById(id); // Throws if not found
    await this.db.delete(departments).where(eq(departments.id, id));
    return { success: true };
  }
}

