import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Inject, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { SERVICES, COMMANDS, LoginDto, RegisterDto, CreateRoleDto, UpdateRoleDto, GetRoleByIdDto, AuthGuard, RolesGuard, Roles } from '@app/common';

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

  @Post('roles')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(['Admin'])
  createRole(@Body() data: CreateRoleDto) {
    return this.authClient.send({ cmd: COMMANDS.AUTH.CREATE_ROLE }, data);
  }

  @Get('roles')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(['Admin'])
  getRoles() {
    return this.authClient.send({ cmd: COMMANDS.AUTH.GET_ROLES }, {});
  }

  @Get('roles/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(['Admin'])
  getRoleById(@Param() params: GetRoleByIdDto) {
    return this.authClient.send({ cmd: COMMANDS.AUTH.GET_ROLE_BY_ID }, { id: params.id });
  }

  @Patch('roles/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(['Admin'])
  updateRole(@Param() params: GetRoleByIdDto, @Body() data: UpdateRoleDto) {
    return this.authClient.send({ cmd: COMMANDS.AUTH.UPDATE_ROLE }, { id: params.id, name: data.name });
  }

  @Delete('roles/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(['Admin'])
  deleteRole(@Param() params: GetRoleByIdDto) {
    return this.authClient.send({ cmd: COMMANDS.AUTH.DELETE_ROLE }, { id: params.id });
  }
}
