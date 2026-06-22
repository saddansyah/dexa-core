import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // 1. HTTP Exceptions
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const res = exception.getResponse();
      const errorDetails = typeof res === 'object' ? res : { message: res };
      return response.status(status).json({
        error: {
          statusCode: status,
          ...errorDetails,
        },
      });
    }

    // 2. Microservice / RPC Exceptions
    const isRpcError = exception && (
      exception.name === 'RpcException' || 
      'error' in exception || 
      'statusCode' in exception || 
      'status' in exception
    );
    if (isRpcError) {
      const rpcError = exception.error || exception;
      const status = rpcError.statusCode || rpcError.status || HttpStatus.BAD_REQUEST;
      const errorDetails = typeof rpcError === 'object' ? rpcError : { message: rpcError };
      return response.status(status).json({
        error: {
          statusCode: status,
          ...errorDetails,
        },
      });
    }

    // 3. Native JS Error Instance
    if (exception instanceof Error) {
      const status = HttpStatus.INTERNAL_SERVER_ERROR;
      return response.status(status).json({
        error: {
          statusCode: status,
          message: exception.message,
        },
      });
    }

    // 4. Default generic fallback
    const status = HttpStatus.INTERNAL_SERVER_ERROR;
    return response.status(status).json({
      error: {
        statusCode: status,
        message: 'Internal server error',
      },
    });
  }
}
