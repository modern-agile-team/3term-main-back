import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignInDto {
  @ApiProperty({
    example: 'estarg1@hanmail.net',
    description: '가입시 입력했던 이메일',
    required: true,
  })
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty({
    example: '1234',
    description: '비밀번호',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
