import { Module } from '@nestjs/common';
import { DevicesController } from './devices.controller';
import { NatsModule } from 'src/transports/nats.module';

@Module({
  imports: [NatsModule],
  controllers: [DevicesController],
})
export class DevicesModule {}
