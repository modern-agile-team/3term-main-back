import { ApiProperty, PickType } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Board } from '../entity/board.entity';

export class BoardPickType extends PickType(Board, [
  'title',
  'description',
] as const) {}

export abstract class BoardContent {
  @ApiProperty({
    example: 10000,
    description: 'Example Description입니다.',
    required: true,
  })
  @IsString()
  price: string;

  @ApiProperty({
    example: '제목 입력',
    description: 'Example Description입니다.',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(15)
  title: string;

  @ApiProperty({
    example: '내용 입력',
    description: 'Example Description입니다.',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  description: string;

  @ApiProperty({
    example: '한줄 요약 입력',
    description: 'Example Description입니다.',
    required: false,
  })
  @IsString()
  @MaxLength(100)
  summary?: string;

  @ApiProperty({
    example: true,
    description: 'Example false = 해주는 사람, true = 구하는 사람.',
    required: true,
  })
  @IsString()
  target: string;

  @ApiProperty({
    example: 3,
    description: 'Example 카테고리.',
    required: true,
  })
  @IsString()
  categoryNo: string;

  @ApiProperty({
    example: 1,
    description: 'Example 지역.',
    required: true,
  })
  @IsString()
  areaNo: string;

  // @ApiProperty({
  //   example: '첫번째 상세조건',
  //   description: 'Example 상세조건1 입니다.',
  //   required: false,
  // })
  // @IsString()
  // @IsOptional()
  // @MaxLength(100)
  // note1?: string;

  // @ApiProperty({
  //   example: '두번째 상세조건',
  //   description: 'Example 상세조건2 입니다.',
  //   required: false,
  // })
  // @IsString()
  // @IsOptional()
  // @MaxLength(100)
  // note2?: string;

  // @ApiProperty({
  //   example: '세번째 상세조건',
  //   description: 'Example 상세조건3 입니다.',
  //   required: false,
  // })
  // @IsString()
  // @IsOptional()
  // @MaxLength(100)
  // note3?: string;
}

export class CreateBoardDto extends BoardContent {
  @ApiProperty({
    example: 0,
    description: 'Example 마감일 0 = 상시, 7 = 일주일, 30 = 1개월, 60 = 3개월',
    required: true,
  })
  @IsString()
  deadline: string;
}

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

export class LikeBoardDto {
  @IsNumber()
  boardNo: number;

  @IsNumber()
  userNo: number;

  @IsBoolean()
  judge: boolean;
}

export abstract class UpdateBoardDto {
  @IsOptional()
  @IsString()
  price?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(15)
  title?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  summary?: string;

  @IsOptional()
  @IsString()
  target?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  area?: string;

  // @IsOptional()
  // @IsString()
  // @MaxLength(100)
  // note1?: string;

  // @IsOptional()
  // @IsString()
  // @MaxLength(100)
  // note2?: string;

  // @IsOptional()
  // @IsString()
  // @MaxLength(100)
  // note3?: string;

  @IsOptional()
  @IsString()
  deadline?: any;
}

export class FilterBoardDto {
  @IsOptional()
  @IsString()
  sort?: any;

  @IsOptional()
  categoryNo?: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  popular?: string;

  @IsOptional()
  @IsString()
  date?: string;

  @IsOptional()
  @IsString()
  free?: string;

  @IsOptional()
  @IsString()
  areaNo?: string;

  @IsOptional()
  @IsString()
  max?: string;

  @IsOptional()
  @IsString()
  min?: string;

  @IsOptional()
  @IsString()
  target?: string;
}
