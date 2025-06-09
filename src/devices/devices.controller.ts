import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  UseGuards,
} from '@nestjs/common';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { NATS_SERVICE } from 'src/config/sercices';
import { ClientProxy } from '@nestjs/microservices';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { GetUser } from 'src/auth/decorators/get-user.decorator';

@Controller('devices')
export class DevicesController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT-auth')
  create(
    @Body() createDeviceDto: CreateDeviceDto,
    @GetUser('_id') userId: string,
  ) {
    return this.client.send('devices.create.device', {
      userId,
      ...createDeviceDto,
    });
  }

  @Get()
  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT-auth')
  findAll(@GetUser('_id') userId: string) {
    return this.client.send('devices.findAll.device', userId);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT-auth')
  findOne(@Param('id') id: string, @GetUser('_id') userId: string) {
    return this.client.send('devices.findOne.device', {
      id,
      userId,
    });
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT-auth')
  update(
    @Param('id') id: string,
    @Body() updateDeviceDto: UpdateDeviceDto,
    @GetUser('_id') userId: string,
  ) {
    return this.client.send('devices.update.device', {
      id,
      userId,
      ...updateDeviceDto,
    });
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT-auth')
  remove(@Param('id') id: string, @GetUser('_id') userId: string) {
    return this.client.send('devices.remove.device', {
      id,
      userId,
    });
  }
}
