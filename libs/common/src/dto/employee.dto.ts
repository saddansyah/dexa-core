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