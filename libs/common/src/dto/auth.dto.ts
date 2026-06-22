import { z } from "zod"
import { createZodDto } from "nestjs-zod"

export const LoginSchema = z.object({
    email: z.email("Email is required"),
    password: z.string().min(1, "Password is required")
})

export class LoginDto extends createZodDto(LoginSchema) { }

export const RegisterSchema = z.object({
    email: z.email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    name: z.string().min(1, "Name is required"),
    dob: z.string().transform(val => new Date(val)),
    roleId: z.string(),
    departmentId: z.number().optional(),
    address: z.string().optional(),
    position: z.string().optional(),
    status: z.enum(['permanent', 'contract', 'intern']).optional().default('contract'),
})

export class RegisterDto extends createZodDto(RegisterSchema) { }