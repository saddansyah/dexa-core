import { Catch, ArgumentsHost, RpcExceptionFilter, Logger } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { RpcException } from '@nestjs/microservices';
import { formatException } from '../errors';

@Catch()
export class MicroserviceExceptionFilter implements RpcExceptionFilter<any> {
  private readonly logger = new Logger(MicroserviceExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost): Observable<any> {
    const formatted = formatException(exception);

    this.logger.error({
      status: formatted.status,
      message: formatted.message,
      error: formatted.error,
    });

    return throwError(() => new RpcException(formatted).getError());
  }
}