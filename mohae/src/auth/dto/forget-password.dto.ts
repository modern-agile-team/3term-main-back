import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class ForgetPasswordDto {
  @ApiProperty({
    example: 'aaa@aaa.aaa',
    description: '가입시 입력했던 이메일',
    required: true,
  })
  @IsString()
  @Matches(/^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/)
  @IsNotEmpty()
  email: string;

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
