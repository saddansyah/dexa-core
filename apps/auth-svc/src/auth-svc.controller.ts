import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { COMMANDS } from '@app/common';
import { AuthSvcService } from './auth-svc.service';

@Controller()
export class AuthSvcController {
  constructor(private readonly authSvcService: AuthSvcService) { }

  @MessagePattern({ cmd: COMMANDS.AUTH.TEST })
  handleTestAuth(@Payload() data: { message: string }) {
    console.log('Received auth test message:', data);
    return {
      success: true,
      service: 'auth-svc',
      receivedMessage: data.message,
      timestamp: new Date().toISOString(),
    };
  }
}
