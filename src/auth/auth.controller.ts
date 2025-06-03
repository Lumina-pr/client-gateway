import { Body, Controller, Inject, Post, Res, UseGuards } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { Response } from 'express';
import { catchError, tap } from 'rxjs';
import { NATS_SERVICE } from 'src/config/sercices';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { Token } from './decorators/token.decorator';
import { AuthGuard } from './guards/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { User } from './decorators/user.decorator';

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
  loginUser(
    @Body() loginUserDto: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.client.send('auth.login.user', loginUserDto).pipe(
      tap((authResponse: any) => {
        const jwtToken = authResponse.access_token;

        res.cookie('authToken', jwtToken, {
          httpOnly: true,
          secure: true,
          sameSite: 'none',
        });

        delete authResponse.access_token;
      }),
      catchError((error) => {
        if (error instanceof RpcException) {
          throw error;
        }
        throw new RpcException(error);
      }),
    );
  }

  @UseGuards(AuthGuard)
  @Post('verify')
  @ApiBearerAuth('JWT-auth')
  verifyToken(
    @Token() token: string,
    @User() user: any,
    @Res({ passthrough: true }) res: Response,
  ) {
    res.cookie('authToken', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });

    return {
      isAuthenticated: true,
      user: user,
    };
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('authToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
    });

    return { message: 'Logout successful' };
  }
}
