import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignDownDto {
  @ApiProperty({
    example: 'aaa@aaa.aaa',
    description: '가입시 입력했던 이메일',
    required: true,
  })
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  email: string;
}
