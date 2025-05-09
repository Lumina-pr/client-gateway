import { Controller, Get, Inject, Param } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { NATS_SERVICE } from 'src/config/sercices';

@Controller('devices-control')
export class DevicesControlController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @Get('ping/:deviceId')
  pingDevice(@Param('deviceId') deviceId: string) {
    return this.client.send('device-control.ping', deviceId).pipe(
      catchError((error) => {
        throw new RpcException(error);
      }),
    );
  }
}
