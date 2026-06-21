import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { DEFAULT_PORTS } from '@app/common';
import { ApiGatewayModule } from './api-gateway.module';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || DEFAULT_PORTS.GATEWAY;

  const winstonService = app.get(WINSTON_MODULE_NEST_PROVIDER);
  app.useLogger(winstonService);

  await app.listen(port);
  winstonService.log(`API Gateway is listening on port ${port}`);
}
bootstrap();

