import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { BaseResponseDto } from '../dtos/base-response.dto';
import { map, Observable } from 'rxjs';

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, BaseResponseDto<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<BaseResponseDto<T>> {
    return next.handle().pipe(
      map((data) => ({
        status: 'success',
        statusCode: context.switchToHttp().getResponse().statusCode,
        data,
      })),
    );
  }
}
