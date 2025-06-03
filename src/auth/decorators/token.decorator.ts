import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';

export const Token = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    if (!request.cookies?.authToken) {
      throw new InternalServerErrorException(
        'Token not found in request (AuthGuard called?)',
      );
    }

    return request.token;
  },
);
