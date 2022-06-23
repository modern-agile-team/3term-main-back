import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class HotBoardDto {
  @ApiProperty({
    example: '1, 2',
    description:
      'Example query를 입력안했을경우 전체게시글, 1 = 마감이 안된 게시글, 2 = 마감된 게시글',
    required: true,
  })
  @IsOptional()
  @IsString()
  select: string;
}
