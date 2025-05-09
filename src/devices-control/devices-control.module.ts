import { Module } from '@nestjs/common';
import { DevicesControlController } from './devices-control.controller';
import { NatsModule } from 'src/transports/nats.module';

@Module({
  imports: [NatsModule],
  controllers: [DevicesControlController],
})
export class DevicesControlModule {}
