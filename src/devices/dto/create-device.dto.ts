import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDeviceDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The name of the device',
    example: 'My Device',
    required: true,
  })
  name: string;
}
