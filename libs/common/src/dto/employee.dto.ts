import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const GetEmployeeByEmailSchema = z.object({
    email: z.email('Invalid email format').min(1, 'Email is required'),
});

export class GetEmployeeByEmailDto extends createZodDto(GetEmployeeByEmailSchema) { }

export const GetEmployeeByIdSchema = z.object({
    id: z.uuidv7().min(1, "ID is required")
})

export class GetEmployeeByIdDto extends createZodDto(GetEmployeeByIdSchema) { }