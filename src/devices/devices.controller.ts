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
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { NATS_SERVICE } from 'src/config/sercices';
import { ClientProxy } from '@nestjs/microservices';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { User } from 'src/auth/decorators/user.decorator';

@Controller('devices')
export class DevicesController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT-auth')
  create(@Body() createDeviceDto: CreateDeviceDto, @User() userId: string) {
    return this.client.send('devices.create.device', {
      userId,
      ...createDeviceDto,
    });
  }

  @Get()
  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT-auth')
  findAll(@User() userId: string) {
    return this.client.send('devices.findAll.device', userId);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT-auth')
  findOne(@Param('id') id: string, @User() userId: string) {
    return this.client.send('devices.findOne.device', {
      id,
      userId,
    });
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT-auth')
  update(@Param('id') id: string, @Body() updateDeviceDto: UpdateDeviceDto) {
    return this.client.send('devices.update.device', {
      id,
      ...updateDeviceDto,
    });
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Delete a device',
    description: 'This endpoint is not implemented yet',
  })
  @ApiResponse({
    status: 501,
    description: 'Not Implemented',
  })
  remove() {
    throw new HttpException('Not Implemented', HttpStatus.NOT_IMPLEMENTED);
  }
}
