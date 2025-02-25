import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    const errors =
      exception.getResponse() instanceof Array ? exception.getResponse() : [];

    response.status(status).json({
      status: 'error',
      statusCode: status,
      message: exception.message,
      errors: errors,
    });
  }
}
