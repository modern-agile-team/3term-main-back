import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber } from 'class-validator';

export class LikeUserDto {
  @ApiProperty({
    example: 1,
    description: '프로필 주인의 고유 번호',
    required: true,
  })
  @IsNumber()
  likedUserNo?: number;

  @ApiProperty({
    example: true,
    description: '좋아요 클릭시 > true, 좋아요 취소시 > false',
    required: true,
  })
  @IsBoolean()
  judge: boolean;
}
