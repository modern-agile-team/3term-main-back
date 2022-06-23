import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class PaginationDto {
  @ApiProperty({
    example: '5',
    description: 'Example 게시글 최대 보여주는 개수 지정',
    required: true,
  })
  @IsString()
  take: string;

  @ApiProperty({
    example: '1',
    description: 'Example 몇번째 페이지 지정',
    required: true,
  })
  @IsString()
  page: string;
}
