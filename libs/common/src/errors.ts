import { HttpException, HttpStatus } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { ZodValidationException } from 'nestjs-zod';
import { ZodError } from 'zod';

export interface CoreErrorResponse {
    status: number;
    message: string;
    error: any;
}

export function formatException(exception: any): CoreErrorResponse {
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal Server Error';
    let errorDetails: any = null;

    if (exception instanceof ZodValidationException || exception instanceof ZodError) {
        const zodError = (exception instanceof ZodValidationException ? exception.getZodError() : exception) as ZodError;
        status = HttpStatus.BAD_REQUEST;
        message = 'Validation failed';
        errorDetails = zodError.issues;
    }

    else if (exception instanceof HttpException) {
        status = exception.getStatus();
        const response = exception.getResponse() as { message: string, error: any };
        if (typeof response === 'object' && response !== null) {
            message = response.message || exception.message;
            errorDetails = response.error !== undefined ? response.error : response;
        } else {
            message = String(response) || exception.message;
            errorDetails = response;
        }
    }

    else if (exception instanceof RpcException) {
        const rpcError = exception.getError() as { status: number, message: string, error: any };
        if (typeof rpcError === 'object' && rpcError !== null) {
            status = rpcError.status || HttpStatus.INTERNAL_SERVER_ERROR;
            message = rpcError.message || 'Internal Server Error';
            errorDetails = rpcError.error !== undefined ? rpcError.error : rpcError;
        } else {
            message = String(rpcError);
            errorDetails = rpcError;
        }
    }

    else if (exception instanceof Error) {
        status = (exception as any).status || (exception as any).statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
        message = exception.message || 'Internal Server Error';
        errorDetails = {
            message: exception.message,
            stack: exception.stack,
            cause: exception.cause,
        };
    }

    else if (typeof exception === 'object' && exception !== null) {
        status = exception.status || exception.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
        message = exception.message || 'Internal Server Error';
        errorDetails = exception.error !== undefined ? exception.error : exception;
    }

    else {
        message = String(exception);
        errorDetails = exception;
    }

    return { status, message, error: errorDetails };
}
