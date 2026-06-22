import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ZodValidationPipe, cleanupOpenApiDoc } from 'nestjs-zod';
import { DEFAULT_PORTS, HttpExceptionFilter, ZodExceptionFilter } from '@app/common';
import { ApiGatewayModule } from './api-gateway.module';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || DEFAULT_PORTS.GATEWAY;
  const winstonService = app.get(WINSTON_MODULE_NEST_PROVIDER);

  app.useLogger(winstonService);
  app.enableCors();
  app.useGlobalPipes(new ZodValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter(), new ZodExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('Dexa Core API')
    .setDescription('API Documentation for Dexa Core')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, cleanupOpenApiDoc(document));

  await app.listen(port);
  winstonService.log(`API Gateway is listening on port ${port}`);
}
bootstrap();
