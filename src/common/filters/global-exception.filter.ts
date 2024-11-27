import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { BaseResponseDto } from '../dtos/base-response.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()['message']
        : 'Internal Server Error';

    const baseResponse: BaseResponseDto<null> = {
      status: 'error',
      statusCode: status,
      message: message,
      errors: [],
    };

    console.log(exception);

    if (exception instanceof PrismaClientKnownRequestError) {
      switch (exception.code) {
        case 'P2002':
          const targetFields = exception.meta?.target;
          baseResponse.statusCode = HttpStatus.CONFLICT;
          baseResponse.message = 'Unique constraint failed';
          baseResponse.errors = [`Duplicate value on fields: ${targetFields}`];
          break;

        case 'P2025':
          baseResponse.statusCode = HttpStatus.NOT_FOUND;
          baseResponse.message = 'Record not found';
          baseResponse.errors = ['The requested record does not exist'];
          break;

        case 'P2003':
          baseResponse.statusCode = HttpStatus.BAD_REQUEST;
          const fieldName = exception.meta?.field_name.toString().split('_')[1];
          baseResponse.message = `Invalid reference for field: ${fieldName}`;
          baseResponse.errors = [
            `The value provided for '${fieldName}' violates the foreign key constraint`,
          ];
          break;

        default:
          baseResponse.statusCode = HttpStatus.BAD_REQUEST;
          baseResponse.message = 'Database error';
          baseResponse.errors = [exception.message];
          break;
      }
    } else if (exception instanceof BadRequestException) {
      const response = exception.getResponse();
      baseResponse.statusCode = HttpStatus.BAD_REQUEST;
      baseResponse.message = 'Validation failed';
      baseResponse.errors = Array.isArray(response['message'])
        ? response['message']
        : [response['message']];
    }

    response.status(baseResponse.statusCode).json(baseResponse);
  }
}
