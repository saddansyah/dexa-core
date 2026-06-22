import { z } from "zod";
import { createZodDto } from "nestjs-zod";

export const CreateRoleSchema = z.object({
  id: z.string().min(1, "Role slug is required"),
  name: z.string().min(1, "Role name is required"),
});

export class CreateRoleDto extends createZodDto(CreateRoleSchema) {}

export const UpdateRoleSchema = z.object({
  name: z.string().min(1, "Role name is required"),
});

export class UpdateRoleDto extends createZodDto(UpdateRoleSchema) {}

export const GetRoleByIdSchema = z.object({
  id: z.string().min(1, "Role ID is required"),
});

export class GetRoleByIdDto extends createZodDto(GetRoleByIdSchema) {}
