import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { BaseResponseDto } from '../dtos/base-response.dto';
import { map, Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, BaseResponseDto<T>>
{
  constructor(private reflector: Reflector) {}
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<BaseResponseDto<T>> {
    const skip = this.reflector.get<boolean>(
      'skipProvider',
      context.getHandler(),
    );
    if (skip) {
      return next.handle();
    }
    return next.handle().pipe(
      map((data) => {
        if (data.status && data.statusCode) {
          return data;
        }
        return {
          status: 'success',
          statusCode: context.switchToHttp().getResponse().statusCode,
          data,
        };
      }),
    );
  }
}
