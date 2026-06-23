import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ZodValidationPipe, cleanupOpenApiDoc } from 'nestjs-zod';
import { DEFAULT_PORTS, HttpExceptionFilter, ResponseInterceptor } from '@app/common';
import { ApiGatewayModule } from './api-gateway.module';
import { ConsoleLogger } from '@nestjs/common';

async function bootstrap() {
  const logger = new ConsoleLogger({
    json: true,
  });

  const app = await NestFactory.create(ApiGatewayModule, { logger });

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || DEFAULT_PORTS.GATEWAY;

  app.enableCors();
  app.useGlobalPipes(new ZodValidationPipe());
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('Dexa Core API')
    .setDescription('API Documentation for Dexa Core')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, cleanupOpenApiDoc(document), { jsonDocumentUrl: 'openapi.json' });

  await app.listen(port);
  logger.log(`API Gateway is listening on port ${port}`);
}
bootstrap();
