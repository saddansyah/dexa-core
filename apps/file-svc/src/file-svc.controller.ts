import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  COMMANDS,
  ServiceUploadFileDto,
  ServiceDeleteFileDto,
  ServiceGetPresignedUrlDto,
} from '@app/common';
import { FileSvcService } from './file-svc.service';

@Controller()
export class FileSvcController {
  constructor(private readonly fileSvcService: FileSvcService) { }

  @MessagePattern({ cmd: COMMANDS.FILE.UPLOAD })
  async handleUploadFile(@Payload() data: ServiceUploadFileDto) {
    const buffer = Buffer.from(data.file.data);
    return this.fileSvcService.uploadFile(data.key, buffer, data.mimeType);
  }

  @MessagePattern({ cmd: COMMANDS.FILE.DELETE })
  async handleDeleteFile(@Payload() data: ServiceDeleteFileDto) {
    await this.fileSvcService.deleteFile(data.key);
    return { success: true };
  }

  @MessagePattern({ cmd: COMMANDS.FILE.GET_PRESIGNED_URL })
  async handleGetPresignedUrl(@Payload() data: ServiceGetPresignedUrlDto) {
    const url = await this.fileSvcService.getPresignedUrl(
      data.key,
      data.expiresInSeconds,
    );
    return { url };
  }
}
