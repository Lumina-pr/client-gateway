import { IsEmail, IsString, IsStrongPassword } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'The email address of the user',
  })
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'StrongP@ssw0rd123',
    description: 'User password that meets strong password requirements',
  })
  @IsString()
  @IsStrongPassword()
  password: string;
}
