import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class LikeBoardDto {
  @ApiProperty({
    example: true,
    description: '게시글 좋아요 = true, 좋아요 취소 = false',
    required: true,
  })
  @IsBoolean()
  judge: boolean;
}
