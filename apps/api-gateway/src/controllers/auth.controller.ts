import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { SERVICES, COMMANDS } from '@app/common';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(SERVICES.AUTH) private readonly authClient: ClientProxy,
  ) {}

  @Get('test')
  testAuth() {
    return this.authClient.send({ cmd: COMMANDS.AUTH.TEST }, { message: 'Ping from Gateway to Auth' });
  }
}
