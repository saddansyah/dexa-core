import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface StandardResponse<T> {
  data: T;
  meta: Record<string, any>;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, StandardResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<StandardResponse<T>> {
    const request = context.switchToHttp().getRequest();

    return next.handle().pipe(
      map((res) => {
        let data = res;
        let responseMeta = {};

        if (res && typeof res === 'object') {
          if ('data' in res) {
            data = res.data;
          }

          // If there is meta property on previous handler call, then include it.
          if ('meta' in res && typeof res.meta === 'object') {
            responseMeta = res.meta;
          }
        }

        return {
          data,
          meta: {
            body: request.body,
            query: request.query,
            params: request.params,
            ...responseMeta,
          },
        };
      }),
    );
  }
}
