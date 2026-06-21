import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { DEFAULT_PORTS } from '@app/common';
import { ApiGatewayModule } from './api-gateway.module';

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : DEFAULT_PORTS.GATEWAY;
  await app.listen(port);
  console.log(`API Gateway is listening on port ${port}...`);
}
bootstrap();
