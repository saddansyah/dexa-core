import { z } from "zod";
import { createZodDto } from "nestjs-zod";

export const CreateRoleSchema = z.object({
  id: z.string().min(1, "Role slug is required").describe("Unique role slug identifier (e.g. admin, hr, employee)"),
  name: z.string().min(1, "Role name is required").describe("Display name of the role (e.g. Admin, HR, Employee)"),
});

export class CreateRoleDto extends createZodDto(CreateRoleSchema) {}

export const UpdateRoleSchema = z.object({
  name: z.string().min(1, "Role name is required").describe("Updated display name of the role"),
});

export class UpdateRoleDto extends createZodDto(UpdateRoleSchema) {}

export const GetRoleByIdSchema = z.object({
  id: z.string().min(1, "Role ID is required").describe("The role slug/ID to retrieve or operations on"),
});

export class GetRoleByIdDto extends createZodDto(GetRoleByIdSchema) {}
