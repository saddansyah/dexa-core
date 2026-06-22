import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DRIZZLE_MODULE_PROVIDER, employees, users } from '@app/database';
import { MySql2Database } from 'drizzle-orm/mysql2';
import * as dbSchema from '@app/database';
import { eq } from 'drizzle-orm';

@Injectable()
export class EmployeeSvcService {
  constructor(
    @Inject(DRIZZLE_MODULE_PROVIDER)
    private readonly db: MySql2Database<typeof dbSchema>,
  ) { }

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
      },
    })
      .from(employees)
      .innerJoin(users, eq(employees.userId, users.id))
      .where(eq(users.id, id));

    if (!result[0]) throw new NotFoundException('Employee not found');

    return result[0]
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
        },
      })
      .from(employees)
      .innerJoin(users, eq(employees.userId, users.id))
      .where(eq(users.email, email));

    if (!result[0]) throw new NotFoundException('Employee not found');

    return result[0]
  }
}
