import { ExceptionFilter, Catch, ArgumentsHost, Logger } from '@nestjs/common';
import { Response } from 'express';
import { formatException } from '../errors';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    console.log(exception)
    const formatted = formatException(exception);

    this.logger.error({
      status: formatted.status,
      message: formatted.message,
      error: formatted.error,
    });

    return response.status(formatted.status).json(formatted);
  }
}