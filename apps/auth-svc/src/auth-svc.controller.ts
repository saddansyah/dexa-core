import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { COMMANDS, LoginDto, RegisterDto, CreateRoleDto, GetRoleByIdDto, RefreshTokenDto } from '@app/common';

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

  @MessagePattern({ cmd: COMMANDS.AUTH.REFRESH_TOKEN })
  async handleRefreshToken(@Payload() data: RefreshTokenDto) {
    const result = await this.authSvcService.refreshToken(data.refreshToken);
    return {
      data: result,
    };
  }

  @MessagePattern({ cmd: COMMANDS.AUTH.LOGOUT })
  async handleLogout(@Payload() data: RefreshTokenDto) {
    const result = await this.authSvcService.logout(data.refreshToken);
    return {
      data: result,
    };
  }

  @MessagePattern({ cmd: COMMANDS.AUTH.CREATE_ROLE })
  async handleCreateRole(@Payload() data: CreateRoleDto) {
    const result = await this.authSvcService.createRole(data.id, data.name);
    return {
      data: result,
    };
  }

  @MessagePattern({ cmd: COMMANDS.AUTH.GET_ROLES })
  async handleGetRoles() {
    const result = await this.authSvcService.getRoles();
    return {
      data: result,
    };
  }

  @MessagePattern({ cmd: COMMANDS.AUTH.GET_ROLE_BY_ID })
  async handleGetRoleById(@Payload() data: GetRoleByIdDto) {
    const result = await this.authSvcService.getRoleById(data.id);
    return {
      data: result,
    };
  }

  @MessagePattern({ cmd: COMMANDS.AUTH.UPDATE_ROLE })
  async handleUpdateRole(@Payload() data: { id: string; name: string }) {
    const result = await this.authSvcService.updateRole(data.id, data.name);
    return {
      data: result,
    };
  }

  @MessagePattern({ cmd: COMMANDS.AUTH.DELETE_ROLE })
  async handleDeleteRole(@Payload() data: GetRoleByIdDto) {
    const result = await this.authSvcService.deleteRole(data.id);
    return {
      data: result,
    };
  }
}
