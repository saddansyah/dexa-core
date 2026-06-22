import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { COMMANDS, LoginDto, RegisterDto } from '@app/common';

import { AuthSvcService } from './auth-svc.service';

@Controller()
export class AuthSvcController {
  constructor(private readonly authSvcService: AuthSvcService) { }

  @MessagePattern({ cmd: COMMANDS.AUTH.REGISTER })
  async handleRegister(@Payload() data: RegisterDto) {
    const result = await this.authSvcService.register(data);
    return {
      data: result,
    };
  }

  @MessagePattern({ cmd: COMMANDS.AUTH.LOGIN })
  async handleLogin(@Payload() data: LoginDto) {
    const { email, password } = data;

    const token = await this.authSvcService.login(email, password);

    return {
      data: token,
    };
  }
}
