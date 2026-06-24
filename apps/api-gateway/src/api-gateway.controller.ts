import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SERVICES } from '@app/common';
import { firstValueFrom, of } from 'rxjs';
import { timeout, catchError } from 'rxjs/operators';
import { ApiGatewayService } from './api-gateway.service';

@ApiTags('Health Check')
@Controller()
export class ApiGatewayController {
  constructor(
    private readonly apiGatewayService: ApiGatewayService,
    @Inject(SERVICES.AUTH) private readonly authClient: ClientProxy,
    @Inject(SERVICES.FILE) private readonly fileClient: ClientProxy,
    @Inject(SERVICES.ATTENDANCE) private readonly attendanceClient: ClientProxy,
    @Inject(SERVICES.EMPLOYEE) private readonly employeeClient: ClientProxy,
  ) { }

  @Get()
  getHello(): string {
    return this.apiGatewayService.getHello();
  }

  @Get('health')
  @ApiOperation({ summary: 'Simple health check for gateway and all microservices' })
  @ApiResponse({ status: 200, description: 'Health check response' })
  async checkHealth() {
    const services = [
      { name: 'auth-svc', client: this.authClient },
      { name: 'file-svc', client: this.fileClient },
      { name: 'attendance-svc', client: this.attendanceClient },
      { name: 'employee-svc', client: this.employeeClient },
    ];

    const serviceStatuses: Record<string, string> = {
      gateway: 'ok',
    };

    let overallHealthy = true;

    for (const service of services) {
      try {
        const response = await firstValueFrom(
          service.client.send({ cmd: 'ping' }, {}).pipe(
            timeout(2000),
            catchError((err) => {
              return of({ status: 'error', message: err.message || 'Timeout/Connection error' });
            }),
          ),
        );

        if (response && response.status === 'ok') {
          serviceStatuses[service.name] = 'ok';
        } else {
          overallHealthy = false;
          serviceStatuses[service.name] = response?.message || 'error';
        }
      } catch (err: any) {
        overallHealthy = false;
        serviceStatuses[service.name] = err.message || 'error';
      }
    }

    return {
      status: overallHealthy ? 'healthy' : 'unhealthy',
      services: serviceStatuses,
    };
  }
}
