import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { ZodError } from 'zod';
import { ZodValidationException } from 'nestjs-zod';

@Catch(ZodValidationException, ZodError)
export class ZodExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const zodError: ZodError =
      exception instanceof ZodValidationException
        ? exception.getZodError()
        : exception;

    response.status(HttpStatus.BAD_REQUEST).json({
      error: {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Validation failed',
        details: zodError.issues.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        })),
      },
    });
  }
}
