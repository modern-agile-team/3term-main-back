import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class JudgeDuplicateNicknameDto {
  @ApiProperty({
    example: 1 || null,
    description:
      '회원가입시 중복확인은 null을 넣어주시면 되고, 프로필 수정에서 중복확인은 회원 번호를 넣어 주시면 됩니다.',
    required: true,
  })
  @IsOptional()
  @IsNumber()
  no?: number;

  @ApiProperty({
    example: 'subro',
    description: '변경할 닉네임.',
    required: true,
  })
  @IsString()
  nickname?: string;
}
