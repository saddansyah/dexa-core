import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const CreateDepartmentSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be at most 100 characters').describe('The name of the department'),
  description: z.string().max(255, 'Description must be at most 255 characters').optional().describe('The optional description of the department'),
});

export class CreateDepartmentDto extends createZodDto(CreateDepartmentSchema) {}

export const UpdateDepartmentSchema = CreateDepartmentSchema.partial();

export class UpdateDepartmentDto extends createZodDto(UpdateDepartmentSchema) {}

export const GetDepartmentByIdSchema = z.object({
  id: z.coerce.number().int().positive().describe('The unique auto-incrementing ID of the department'),
});

export class GetDepartmentByIdDto extends createZodDto(GetDepartmentByIdSchema) {}

export const GetDepartmentsSchema = z.object({
  limit: z.coerce.number().min(1).max(100).optional().default(10).describe('Max records to return per page'),
  page: z.coerce.number().min(1).optional().default(1).describe('Page number (1-indexed)'),
});

export class GetDepartmentsDto extends createZodDto(GetDepartmentsSchema) {}

export const DepartmentResponseSchema = z.object({
  id: z.number().describe('The unique auto-incrementing ID of the department'),
  name: z.string().describe('The name of the department'),
  description: z.string().nullable().optional().describe('The optional description of the department'),
  createdAt: z.string().describe('Creation timestamp'),
  updatedAt: z.string().describe('Last updated timestamp'),
});

export class DepartmentResponseDto extends createZodDto(DepartmentResponseSchema) {}

