import { Inject, Injectable, ConflictException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DRIZZLE_MODULE_PROVIDER, users, employees, roles } from '@app/database';
import { MySql2Database } from 'drizzle-orm/mysql2';
import * as dbSchema from '@app/database';
import { eq } from 'drizzle-orm';
import { v7 as uuidv7 } from 'uuid';
import { RegisterDto, hashPassword, comparePassword } from '@app/common';

@Injectable()
export class AuthSvcService {
  constructor(
    @Inject(DRIZZLE_MODULE_PROVIDER)
    private readonly db: MySql2Database<typeof dbSchema>,
    private readonly jwtService: JwtService,
  ) { }

  async register(data: RegisterDto) {
    const { email, password, name, dob, roleId, departmentId, address, position, status } = data;

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
        joinDate: new Date(),
      });
    });

    return {
      userId,
      employeeId,
      email,
      name,
    };
  }

  async login(email: string, password: string): Promise<{ access_token: string }> {
    const userResult = await this.db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    const user = userResult[0];
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const employeeResult = await this.db
      .select()
      .from(employees)
      .where(eq(employees.userId, user.id))
      .limit(1);

    const employee = employeeResult[0];

    const payload = {
      sub: user.id,
      email: user.email,
      roleId: user.roleId,
      role: user.roleId,
      employeeId: employee?.id,
      name: employee?.name,
    };

    const token = await this.jwtService.signAsync(payload);

    return {
      access_token: token,
    };
  }

  async createRole(id: string, name: string) {
    const existing = await this.db.select().from(roles).where(eq(roles.id, id)).limit(1);
    if (existing[0]) {
      throw new ConflictException('Role slug already exists');
    }
    await this.db.insert(roles).values({ id, name });
    return { id, name };
  }

  async getRoles() {
    return this.db.select().from(roles);
  }

  async getRoleById(id: string) {
    const roleResult = await this.db.select().from(roles).where(eq(roles.id, id)).limit(1);
    if (!roleResult[0]) {
      throw new NotFoundException('Role not found');
    }
    return roleResult[0];
  }

  async updateRole(id: string, name: string) {
    const roleResult = await this.db.select().from(roles).where(eq(roles.id, id)).limit(1);
    if (!roleResult[0]) {
      throw new NotFoundException('Role not found');
    }
    await this.db.update(roles).set({ name }).where(eq(roles.id, id));
    return { id, name };
  }

  async deleteRole(id: string) {
    const roleResult = await this.db.select().from(roles).where(eq(roles.id, id)).limit(1);
    if (!roleResult[0]) {
      throw new NotFoundException('Role not found');
    }
    await this.db.delete(roles).where(eq(roles.id, id));
    return { success: true };
  }
}
