import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    if (!request.cookies.authToken) {
      throw new InternalServerErrorException(
        'User not found in request (AuthGuard called?)',
      );
    }

    return request.user;
  },
);
