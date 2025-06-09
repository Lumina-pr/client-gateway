import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    console.log('GetUser decorator called, user:', user);

    return data ? user?.[data] : user; // Si se pasa un campo (como 'id'), devuelve solo ese campo
  },
);
