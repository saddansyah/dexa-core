import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { COMMANDS } from '@app/common';
import { FileSvcService } from './file-svc.service';

@Controller()
export class FileSvcController {
  constructor(private readonly fileSvcService: FileSvcService) {}

  @MessagePattern({ cmd: COMMANDS.FILE.TEST })
  handleTestFile(@Payload() data: { message: string }) {
    console.log('Received file test message:', data);
    return {
      success: true,
      service: 'file-svc',
      receivedMessage: data.message,
      timestamp: new Date().toISOString(),
    };
  }

  @MessagePattern({ cmd: COMMANDS.FILE.UPLOAD })
  async handleUploadFile(
    @Payload() data: { key: string; file: { type: string; data: number[] }; mimeType?: string },
  ) {
    const buffer = Buffer.from(data.file.data);
    return this.fileSvcService.uploadFile(data.key, buffer, data.mimeType);
  }

  @MessagePattern({ cmd: COMMANDS.FILE.DELETE })
  async handleDeleteFile(@Payload() data: { key: string }) {
    await this.fileSvcService.deleteFile(data.key);
    return { success: true };
  }

  @MessagePattern({ cmd: COMMANDS.FILE.GET_PRESIGNED_URL })
  async handleGetPresignedUrl(@Payload() data: { key: string; expiresInSeconds?: number }) {
    const url = await this.fileSvcService.getPresignedUrl(data.key, data.expiresInSeconds);
    return { url };
  }
}

