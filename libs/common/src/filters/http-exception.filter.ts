import { ExceptionFilter, Catch, ArgumentsHost, Logger, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { formatException } from '../errors';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    const formatted = formatException(exception);

    this.logger.error({
      status: formatted.status,
      message: formatted.message,
      error: formatted.error,
    });

    if (Number(formatted.status) >= 500) {
      formatted.message = 'Internal Server Error';
      formatted.error = null;
    }

    return response.status(formatted.status).json(formatted);
  }
}