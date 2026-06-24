import { Inject, Injectable, ConflictException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DRIZZLE_MODULE_PROVIDER, users, employees, roles, refreshTokens } from '@app/database';
import { MySql2Database } from 'drizzle-orm/mysql2';
import * as dbSchema from '@app/database';
import { eq } from 'drizzle-orm';
import { v7 as uuidv7 } from 'uuid';
import { RegisterDto, hashPassword, comparePassword, JwtPayloadDto, RefreshTokenDto } from '@app/common';

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
        dob: dob.toISOString().split('T')[0],
        departmentId: departmentId ?? null,
        address: address ?? null,
        position: position ?? null,
        status: status ?? 'contract',
        joinDate: new Date().toISOString().split('T')[0],
      });
    });

    return {
      userId,
      employeeId,
      email,
      name,
    };
  }

  async login(email: string, password: string): Promise<{ access_token: string; refresh_token: string }> {
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

    const payload: JwtPayloadDto = {
      sub: user.id,
      email: user.email,
      roleId: user.roleId,
      role: user.roleId,
      employeeId: employee?.id ?? undefined,
      name: employee?.name ?? undefined,
    };

    const accessToken = await this.jwtService.signAsync(payload, { expiresIn: '15m' });
    const refreshTokenPayload: RefreshTokenDto = {
      sub: user.id,
      type: 'refresh',
    };
    const refreshToken = await this.jwtService.signAsync(refreshTokenPayload, { expiresIn: '7d' });

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // Save refresh token to database
    await this.db.insert(refreshTokens).values({
      userId: user.id,
      token: refreshToken,
      expiresAt,
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async refreshToken(refreshToken: string): Promise<{ access_token: string; refresh_token: string }> {
    try {
      const payload = await this.jwtService.verifyAsync<RefreshTokenDto>(refreshToken);
      if (payload.type !== 'refresh') {
        throw new UnauthorizedException('Invalid token type');
      }

      // Check if token exists in DB
      const storedTokenResult = await this.db
        .select()
        .from(refreshTokens)
        .where(eq(refreshTokens.token, refreshToken))
        .limit(1);

      const storedToken = storedTokenResult[0];
      if (!storedToken) {
        throw new UnauthorizedException('Refresh token is invalid or has been revoked');
      }

      // Check if expired
      if (new Date() > new Date(storedToken.expiresAt)) {
        await this.db.delete(refreshTokens).where(eq(refreshTokens.id, storedToken.id));
        throw new UnauthorizedException('Refresh token has expired');
      }

      // Fetch user and employee to construct new payload then generate new token pair
      const userResult = await this.db
        .select()
        .from(users)
        .where(eq(users.id, payload.sub))
        .limit(1);

      const user = userResult[0];
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const employeeResult = await this.db
        .select()
        .from(employees)
        .where(eq(employees.userId, user.id))
        .limit(1);

      const employee = employeeResult[0];

      const newPayload: JwtPayloadDto = {
        sub: user.id,
        email: user.email,
        roleId: user.roleId,
        role: user.roleId,
        employeeId: employee?.id ?? undefined,
        name: employee?.name ?? undefined,
      };

      const accessToken = await this.jwtService.signAsync(newPayload, { expiresIn: '15m' });
      const newRefreshTokenPayload: RefreshTokenDto = {
        sub: user.id,
        type: 'refresh',
      };
      const newRefreshToken = await this.jwtService.signAsync(newRefreshTokenPayload, { expiresIn: '7d' });

      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      // Perform Token Rotation: Delete old, insert new
      await this.db.transaction(async (tx) => {
        await tx.delete(refreshTokens).where(eq(refreshTokens.id, storedToken.id));
        await tx.insert(refreshTokens).values({
          userId: user.id,
          token: newRefreshToken,
          expiresAt,
        });
      });

      return {
        access_token: accessToken,
        refresh_token: newRefreshToken,
      };
    } catch (e) {
      if (e instanceof UnauthorizedException) {
        throw e;
      }
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async logout(token: string): Promise<{ success: boolean }> {
    await this.db.delete(refreshTokens).where(eq(refreshTokens.token, token));
    return { success: true };
  }

  async logoutAll(userId: string): Promise<{ success: boolean }> {
    await this.db.delete(refreshTokens).where(eq(refreshTokens.userId, userId));
    return { success: true };
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
