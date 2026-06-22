import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const UploadFileSchema = z.object({
  key: z.string().optional().describe('The filename or unique storage key in S3'),
  folder: z.string().optional().describe('Optional subfolder in S3 (e.g., "attendance", "avatar")'),
});

export class UploadFileDto extends createZodDto(UploadFileSchema) { }

export const DeleteFileSchema = z.object({
  key: z.string().min(1, 'Key is required').describe('The file key to be deleted'),
});

export class DeleteFileDto extends createZodDto(DeleteFileSchema) { }

export const GetPresignedUrlSchema = z.object({
  key: z.string().min(1, 'Key is required').describe('The file key to download or access'),
  expiresInSeconds: z.coerce
    .number()
    .int()
    .positive()
    .optional()
    .describe('URL expiration duration in seconds'),
});

export class GetPresignedUrlDto extends createZodDto(GetPresignedUrlSchema) { }

export const ServiceUploadFileSchema = z.object({
  key: z.string().min(1, 'Key is required').describe('Unique file key for upload'),
  file: z.object({
    type: z.literal('Buffer').describe('Binary file type'),
    data: z.array(z.number()).describe('Byte array of the file data'),
  }).describe('Binary file buffer data'),
  mimeType: z.string().optional().describe('MIME type of the file'),
});

export class ServiceUploadFileDto extends createZodDto(ServiceUploadFileSchema) { }

export const ServiceDeleteFileSchema = z.object({
  key: z.string().min(1, 'Key is required').describe('The file key to be deleted'),
});

export class ServiceDeleteFileDto extends createZodDto(ServiceDeleteFileSchema) { }

export const ServiceGetPresignedUrlSchema = z.object({
  key: z.string().min(1, 'Key is required').describe('The file key to access download'),
  expiresInSeconds: z.coerce
    .number()
    .int()
    .positive()
    .optional()
    .describe('URL expiration duration in seconds'),
});

export class ServiceGetPresignedUrlDto extends createZodDto(ServiceGetPresignedUrlSchema) { }
