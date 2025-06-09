import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { LoginUserDto } from './dto/login-user.dto';
import { firstValueFrom } from 'rxjs';
import { NATS_SERVICE } from 'src/config/sercices';

@Injectable()
export class AuthService {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  async validateUser(loginUserDto: LoginUserDto) {
    const result = await firstValueFrom(
      this.client.send('auth.login.user', loginUserDto),
    );

    if (!result) {
      return null;
    }

    return result;
  }

  async findUserById(userId: string) {
    const result = await firstValueFrom(
      this.client.send('user.findUserById', userId),
    );

    if (!result) {
      return null;
    }

    return result;
  }
}
