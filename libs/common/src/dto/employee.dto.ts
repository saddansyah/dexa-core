import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const GetEmployeeByEmailSchema = z.object({
    email: z.email('Invalid email format').min(1, 'Email is required').describe('The email address of the employee to retrieve'),
});

export class GetEmployeeByEmailDto extends createZodDto(GetEmployeeByEmailSchema) { }

export const GetEmployeeByIdSchema = z.object({
    id: z.uuidv7().min(1, "ID is required").describe('The unique UUID v7 identifier of the employee')
})

export class GetEmployeeByIdDto extends createZodDto(GetEmployeeByIdSchema) { }

export const CreateEmployeeSchema = z.object({
    email: z.email("Invalid email format").min(1, "Email is required").describe("Unique email address of the employee"),
    password: z.string().min(6, "Password must be at least 6 characters").describe("Secure password for the account"),
    name: z.string().min(1, "Name is required").describe("Full name of the employee"),
    dob: z.iso.date().describe("Date of birth in string format (YYYY-MM-DD)"),
    roleId: z.string().min(1, "Role ID is required").describe("ID of the role assigned (e.g. admin, hr, employee)"),
    departmentId: z.number().optional().describe("Optional department ID assigned to this employee"),
    address: z.string().optional().describe("Optional residential address of the employee"),
    position: z.string().optional().describe("Optional job title or position"),
    status: z.enum(['permanent', 'contract', 'intern']).optional().default('contract').describe("Employment status/type of contract"),
    joinDate: z.iso.date().optional().describe("Optional join date string (YYYY-MM-DD, defaults to today)"),
});

export class CreateEmployeeDto extends createZodDto(CreateEmployeeSchema) { }

export const UpdateEmployeeSchema = z.object({
    roleId: z.string().optional().describe("Updated role ID (e.g. admin, hr, employee)"),
    name: z.string().optional().describe("Updated name of the employee"),
    dob: z.iso.date().optional().describe("Updated date of birth string (YYYY-MM-DD)"),
    departmentId: z.number().nullable().optional().describe("Updated department ID"),
    address: z.string().optional().describe("Updated residential address"),
    position: z.string().optional().describe("Updated job title or position"),
    status: z.enum(['permanent', 'contract', 'intern']).optional().describe("Updated employment status"),
    joinDate: z.iso.date().optional().describe("Updated join date string (YYYY-MM-DD)"),
    resignDate: z.string().optional().describe("Updated resign date string (YYYY-MM-DD)"),
});

export class UpdateEmployeeDto extends createZodDto(UpdateEmployeeSchema) { }

export const GetEmployeesSchema = z.object({
    departmentId: z.coerce.number().optional().describe("Filter by department ID"),
    status: z.enum(['permanent', 'contract', 'intern']).optional().describe("Filter by employment status"),
    limit: z.coerce.number().min(1).max(100).optional().default(10).describe("Max records to return per page"),
    page: z.coerce.number().min(1).optional().default(1).describe("Page number (1-indexed)"),
});

export class GetEmployeesDto extends createZodDto(GetEmployeesSchema) { }