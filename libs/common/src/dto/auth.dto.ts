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