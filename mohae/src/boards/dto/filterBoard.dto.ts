import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { PaginationDto } from './pagination.dto';

export class FilterBoardDto extends PaginationDto {
  @ApiProperty({
    example: 'ASC',
    description: 'ASC = 오래된 순, DESC = 최신순',
    required: true,
  })
  @IsOptional()
  @IsString()
  sort?: any;

  @ApiProperty({
    example: '17',
    description: '카테고리 번호',
    required: true,
  })
  @IsOptional()
  categoryNo?: string;

  @ApiProperty({
    example: 'test',
    description: '게시글 제목',
    required: true,
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(15)
  title?: string;

  @ApiProperty({
    example: '1',
    description: '게시글 인기 순',
    required: true,
  })
  @IsOptional()
  @IsString()
  popular?: string;

  @ApiProperty({
    example: '7',
    description: '7 = 일주일, 30 = 1개월, 60 = 3개월',
    required: true,
  })
  @IsOptional()
  @IsString()
  date?: string;

  @ApiProperty({
    example: '1',
    description: '무료나눔',
    required: true,
  })
  @IsOptional()
  @IsString()
  free?: string;

  @ApiProperty({
    example: '1',
    description: '지역번호',
    required: true,
  })
  @IsOptional()
  @IsString()
  areaNo?: string;

  @ApiProperty({
    example: '10000',
    description: '최대 가격',
    required: true,
  })
  @IsOptional()
  @IsString()
  max?: string;

  @ApiProperty({
    example: '0',
    description: '최소 가격',
    required: true,
  })
  @IsOptional()
  @IsString()
  min?: string;

  @ApiProperty({
    example: '0',
    description: '0 = 해줄래요(!), 1 = 구할래요(?)',
    required: true,
  })
  @IsOptional()
  @IsString()
  target?: string;
}
