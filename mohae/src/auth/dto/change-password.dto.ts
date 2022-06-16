import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({
    example: 'aaa@aaa.aaa',
    description: '가입시 입력했던 이메일',
    required: true,
  })
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'subro',
    description: '현재 비밀번호',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  nowPassword: string;

  @ApiProperty({
    example: 'hello',
    description: '변경할 비밀번호',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  changePassword: string;

  @ApiProperty({
    example: 'hello',
    description: '변경할 비밀번호 확인',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  confirmChangePassword: string;
}
