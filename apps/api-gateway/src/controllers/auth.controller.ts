import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Inject, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { SERVICES, COMMANDS, LoginDto, RegisterDto, CreateRoleDto, UpdateRoleDto, GetRoleByIdDto, AuthGuard, RolesGuard, Roles, RefreshTokenBodyDto, CurrentUser, JwtPayloadDto } from '@app/common';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    @Inject(SERVICES.AUTH) private readonly authClient: ClientProxy,
  ) { }

  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  @Roles(['admin'])
  @ApiOperation({ summary: 'Register a new user/employee (Admin only)' })
  @ApiResponse({ status: 201, description: 'Successfully registered user' })
  register(@Body() data: RegisterDto) {
    return this.authClient.send({ cmd: COMMANDS.AUTH.REGISTER }, data);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'Successfully logged in' })
  login(@Body() data: LoginDto) {
    return this.authClient.send({ cmd: COMMANDS.AUTH.LOGIN }, data);
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  @ApiOperation({ summary: 'Refresh authentication token' })
  @ApiResponse({ status: 200, description: 'Successfully refreshed token' })
  refresh(@Body() data: RefreshTokenBodyDto) {
    return this.authClient.send({ cmd: COMMANDS.AUTH.REFRESH_TOKEN }, data);
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  @ApiOperation({ summary: 'User logout' })
  @ApiResponse({ status: 200, description: 'Successfully logged out' })
  logout(@Body() data: RefreshTokenBodyDto) {
    return this.authClient.send({ cmd: COMMANDS.AUTH.LOGOUT }, data);
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout-all')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Logout from all devices' })
  @ApiResponse({ status: 200, description: 'Successfully logged out from all devices' })
  logoutAll(@CurrentUser() user: JwtPayloadDto) {
    return this.authClient.send({ cmd: COMMANDS.AUTH.LOGOUT_ALL }, { userId: user.sub });
  }

  @Post('roles')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(['admin'])
  @ApiOperation({ summary: 'Create a new role (Admin only)' })
  @ApiResponse({ status: 201, description: 'Successfully created role' })
  createRole(@Body() data: CreateRoleDto) {
    return this.authClient.send({ cmd: COMMANDS.AUTH.CREATE_ROLE }, data);
  }

  @Get('roles')
  @UseGuards(AuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Get all roles (Admin only)' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved all roles' })
  getRoles() {
    return this.authClient.send({ cmd: COMMANDS.AUTH.GET_ROLES }, {});
  }

  @Get('roles/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Get role details by ID (Admin only)' })
  @ApiParam({ name: 'id', type: 'string', description: 'Unique ID of the role' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved role details' })
  getRoleById(@Param() params: GetRoleByIdDto) {
    return this.authClient.send({ cmd: COMMANDS.AUTH.GET_ROLE_BY_ID }, { id: params.id });
  }

  @Patch('roles/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(['admin'])
  @ApiOperation({ summary: 'Update role by ID (Admin only)' })
  @ApiParam({ name: 'id', type: 'string', description: 'Unique ID of the role' })
  @ApiResponse({ status: 200, description: 'Successfully updated role' })
  updateRole(@Param() params: GetRoleByIdDto, @Body() data: UpdateRoleDto) {
    return this.authClient.send({ cmd: COMMANDS.AUTH.UPDATE_ROLE }, { id: params.id, name: data.name });
  }

  @Delete('roles/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(['admin'])
  @ApiOperation({ summary: 'Delete role by ID (Admin only)' })
  @ApiParam({ name: 'id', type: 'string', description: 'Unique ID of the role' })
  @ApiResponse({ status: 200, description: 'Successfully deleted role' })
  deleteRole(@Param() params: GetRoleByIdDto) {
    return this.authClient.send({ cmd: COMMANDS.AUTH.DELETE_ROLE }, { id: params.id });
  }
}
