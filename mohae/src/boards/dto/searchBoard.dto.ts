import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class SearchBoardDto {
  @ApiProperty({
    example: '게시글',
    description: 'Example 검색 입력 입니다.',
    required: true,
  })
  @IsString()
  @MaxLength(16)
  @MinLength(2)
  title: string;
}
