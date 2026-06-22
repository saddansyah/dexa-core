import { Body, Controller, Get, HttpCode, HttpStatus, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { SERVICES, COMMANDS, LoginDto, RegisterDto } from '@app/common';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(SERVICES.AUTH) private readonly authClient: ClientProxy,
  ) { }

  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  register(@Body() data: RegisterDto) {
    return this.authClient.send({ cmd: COMMANDS.AUTH.REGISTER }, data);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() data: LoginDto) {
    return this.authClient.send({ cmd: COMMANDS.AUTH.LOGIN }, data);
  }
}
