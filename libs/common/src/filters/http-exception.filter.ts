import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    const status = exception.getStatus();
    const res = exception.getResponse();

    const errorDetails = typeof res === 'object' && res !== null ? res : { message: res };

    return response.status(status).json({
      error: {
        statusCode: status,
        ...errorDetails,
      },
    });
  }
}


