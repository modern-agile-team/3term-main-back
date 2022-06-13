import { ApiProperty, PickType } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class SignUpDto {
  @ApiProperty({
    example: 'aaa@aaa.aaa',
    description: '가입하려는 이메일',
    required: true,
  })
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'ilovebodybuilding',
    description: '비밀번호',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    example: '수브로',
    description: '이름',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'subro',
    description: '닉네임',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  nickname: string;

  @ApiProperty({
    example: '01000000000',
    description: '사용자 전화번호',
    required: false,
  })
  @IsString()
  phone: string;

  @ApiProperty({
    example: false,
    description: '관리자 인지 아닌지 일반회원은 false',
    required: true,
  })
  @IsBoolean()
  manager: boolean;

  @ApiProperty({
    example: 1,
    description:
      '회원가입시 선택한 학교 고유번호 (학교 선택 안하면 [1] 보내주시면 됩니다.)',
    required: true,
  })
  @IsOptional()
  @IsNumber()
  school?: number;

  @ApiProperty({
    example: 1,
    description:
      '회원가입시 선택한 전공 고유번호 (전공 선택 안하면 [1] 보내주시면 됩니다.)',
    required: true,
  })
  @IsOptional()
  @IsNumber()
  // Matches 사용하여 DB에 있는 전공 값 맞춰보기
  major?: number;

  @ApiProperty({
    example: [2, 3],
    description:
      '회원가입시 선택한 관심사 (관심사 선택 안하면 [1] 보내주시면 됩니다.)',
    required: true,
  })
  @IsOptional()
  @IsArray()
  categories?: [];

  @ApiProperty({
    example: [true, true, false],
    description: '회원가입시 체크한 약관동의',
    required: true,
  })
  @IsArray()
  @IsNotEmpty()
  terms: [];
}
