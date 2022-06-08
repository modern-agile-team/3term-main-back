import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class SignDownDto {
  @ApiProperty({
    example: 'aaa@aaa.aaa',
    description: '가입시 입력했던 이메일',
    required: true,
  })
  @Matches(/^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/)
  @IsNotEmpty()
  @IsString()
  email: string;
}
