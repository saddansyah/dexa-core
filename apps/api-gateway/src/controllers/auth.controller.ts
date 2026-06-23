import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Inject, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { SERVICES, COMMANDS, LoginDto, RegisterDto, CreateRoleDto, UpdateRoleDto, GetRoleByIdDto, AuthGuard, RolesGuard, Roles, RefreshTokenBodyDto, CurrentUser, JwtPayloadDto } from '@app/common';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(SERVICES.AUTH) private readonly authClient: ClientProxy,
  ) { }

  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  @Roles(['admin'])
  register(@Body() data: RegisterDto) {
    return this.authClient.send({ cmd: COMMANDS.AUTH.REGISTER }, data);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() data: LoginDto) {
    return this.authClient.send({ cmd: COMMANDS.AUTH.LOGIN }, data);
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  refresh(@Body() data: RefreshTokenBodyDto) {
    return this.authClient.send({ cmd: COMMANDS.AUTH.REFRESH_TOKEN }, data);
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  logout(@Body() data: RefreshTokenBodyDto) {
    return this.authClient.send({ cmd: COMMANDS.AUTH.LOGOUT }, data);
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout-all')
  @UseGuards(AuthGuard)
  logoutAll(@CurrentUser() user: JwtPayloadDto) {
    return this.authClient.send({ cmd: COMMANDS.AUTH.LOGOUT_ALL }, { userId: user.sub });
  }

  @Post('roles')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(['admin'])
  createRole(@Body() data: CreateRoleDto) {
    return this.authClient.send({ cmd: COMMANDS.AUTH.CREATE_ROLE }, data);
  }

  @Get('roles')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(['admin'])
  getRoles() {
    return this.authClient.send({ cmd: COMMANDS.AUTH.GET_ROLES }, {});
  }

  @Get('roles/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(['admin'])
  getRoleById(@Param() params: GetRoleByIdDto) {
    return this.authClient.send({ cmd: COMMANDS.AUTH.GET_ROLE_BY_ID }, { id: params.id });
  }

  @Patch('roles/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(['admin'])
  updateRole(@Param() params: GetRoleByIdDto, @Body() data: UpdateRoleDto) {
    return this.authClient.send({ cmd: COMMANDS.AUTH.UPDATE_ROLE }, { id: params.id, name: data.name });
  }

  @Delete('roles/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(['admin'])
  deleteRole(@Param() params: GetRoleByIdDto) {
    return this.authClient.send({ cmd: COMMANDS.AUTH.DELETE_ROLE }, { id: params.id });
  }
}
