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
}
