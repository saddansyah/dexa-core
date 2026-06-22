import { Inject, Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DRIZZLE_MODULE_PROVIDER, users, employees } from '@app/database';
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
      employeeId: employee?.id,
      name: employee?.name,
    };

    const token = await this.jwtService.signAsync(payload);

    return {
      access_token: token,
    };
  }
}
