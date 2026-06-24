import { z } from "zod"
import { createZodDto } from "nestjs-zod"

export const LoginSchema = z.object({
    email: z.email("Email is required").describe("The registered email address of the user"),
    password: z.string().min(1, "Password is required").describe("The secret password of the user's account")
})

export class LoginDto extends createZodDto(LoginSchema) { }

export const RegisterSchema = z.object({
    email: z.email("Invalid email format").describe("Unique email address of the employee"),
    password: z.string().min(6, "Password must be at least 6 characters").describe("Secure password for the account (minimum 6 characters)"),
    name: z.string().min(1, "Name is required").describe("Full name of the employee"),
    dob: z.string().transform(val => new Date(val)).describe("Date of birth in string that can be parsed to JS new Date() format"),
    roleId: z.string().describe("ID of the role assigned to this employee"),
    departmentId: z.number().optional().describe("Optional department ID assigned to this employee"),
    address: z.string().optional().describe("Optional residential address of the employee"),
    position: z.string().optional().describe("Optional job title or position within the company"),
    status: z.enum(['permanent', 'contract', 'intern']).optional().default('contract').describe("Employment status/type of contract"),
})

export class RegisterDto extends createZodDto(RegisterSchema) { }

export const RefreshTokenBodySchema = z.object({
    refreshToken: z.string().min(1, "Refresh token is required").describe("The active refresh token of the user"),
})

export class RefreshTokenBodyDto extends createZodDto(RefreshTokenBodySchema) { }

export const RefreshTokenPayloadSchema = z.object({
    sub: z.string().describe("User ID associated with the refresh token"),
    type: z.literal("refresh").describe("Token type"),
    iat: z.number().optional().describe("Issued at timestamp"),
    exp: z.number().optional().describe("Expiration timestamp"),
})

export class RefreshTokenDto extends createZodDto(RefreshTokenPayloadSchema) { }

export const JwtPayloadSchema = z.object({
    sub: z.string().describe("User ID"),
    email: z.email().describe("User email address"),
    roleId: z.string().describe("Role ID"),
    role: z.string().describe("Role name/ID"),
    employeeId: z.string().optional().describe("Employee ID if applicable"),
    name: z.string().optional().describe("Employee name if applicable"),
    iat: z.number().optional().describe("Issued at timestamp"),
    exp: z.number().optional().describe("Expiration timestamp"),
})

export class JwtPayloadDto extends createZodDto(JwtPayloadSchema) { }

export const LoginResponseSchema = z.object({
  access_token: z.string().describe('JWT access token used for authorization'),
  refresh_token: z.string().describe('JWT refresh token used to generate new access tokens'),
});

export class LoginResponseDto extends createZodDto(LoginResponseSchema) { }

export const RegisterResponseSchema = z.object({
  userId: z.string().describe('The unique identifier of the registered user'),
  employeeId: z.string().describe('The unique identifier of the registered employee'),
  email: z.string().describe('The registered email address'),
  name: z.string().describe('The full name of the employee'),
});

export class RegisterResponseDto extends createZodDto(RegisterResponseSchema) { }

export const SuccessResponseSchema = z.object({
  success: z.boolean().describe('Indicates whether the operation was successful'),
});

export class SuccessResponseDto extends createZodDto(SuccessResponseSchema) { }