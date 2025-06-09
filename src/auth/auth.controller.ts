import { Body, Controller, Inject, Post, Req, UseGuards } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { Request } from 'express';
import { catchError } from 'rxjs';
import { NATS_SERVICE } from 'src/config/sercices';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

import { LocalAuthGuard } from './guards/local-auth.guard';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @Post('register')
  registerUser(@Body() registerUserDto: RegisterUserDto) {
    return this.client.send('auth.register.user', registerUserDto).pipe(
      catchError((error) => {
        throw new RpcException(error);
      }),
    );
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @ApiBody({ type: LoginUserDto })
  // eslint-disable-next-line @typescript-eslint/require-await
  async login(@Req() req: Request) {
    return req.user;
  }

  @Post('logout')
  @ApiOperation({ summary: 'Logout user from session' })
  @ApiResponse({ status: 200, description: 'User successfully logged out' })
  logout(@Req() req: Request) {
    req.logOut((err) => {
      if (err) {
        throw new RpcException('Logout failed');
      }
    });

    return { message: 'Logout successful' };
  }
}
