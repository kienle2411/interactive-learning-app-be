import {
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
} from '@nestjs/common';

export const ResponseMessage = createParamDecorator(
  (message: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    request.responseMessage = message;
    return null;
  },
);

export const ApiResponse = (resMessage: string) =>
  SetMetadata('response_message', resMessage);
