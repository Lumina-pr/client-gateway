import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { DevicesModule } from './devices/devices.module';
import { DevicesControlModule } from './devices-control/devices-control.module';

@Module({
  imports: [AuthModule, DevicesModule, DevicesControlModule],
})
export class AppModule {}
