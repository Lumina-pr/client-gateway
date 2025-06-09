import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private authService: AuthService) {
    super();
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  serializeUser(user: any, done: Function): any {
    console.log('Serializing user:', user.id);
    done(null, user.id);
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  async deserializeUser(userId: string, done: Function): Promise<any> {
    try {
      const user = await this.authService.findUserById(userId);
      console.log('Deserializing user:', user?.id);
      done(null, user);
    } catch (error) {
      console.error('Error deserializing user:', error);
      done(error, null);
    }
  }
}
