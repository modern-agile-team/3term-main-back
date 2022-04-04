import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDate, IsNumber, IsString } from 'class-validator';

export abstract class BoardContent {
  @ApiProperty({
    example: 10000,
    description: 'Example Description입니다.',
    required: true,
  })
  @IsNumber()
  price: number;

  @ApiProperty({
    example: '제목 입력',
    description: 'Example Description입니다.',
    required: true,
  })
  @IsString()
  title: string;

  @ApiProperty({
    example: '내용 입력',
    description: 'Example Description입니다.',
    required: true,
  })
  @IsString()
  description: string;

  @ApiProperty({
    example: '한줄 요약 입력',
    description: 'Example Description입니다.',
    required: false,
  })
  @IsString()
  summary?: string;

  @ApiProperty({
    example: true,
    description: 'Example 해주는 사람, 구하는 사람.',
    required: true,
  })
  @IsBoolean()
  target: boolean;

  @ApiProperty({
    example: 3,
    description: 'Example 카테고리.',
    required: true,
  })
  @IsNumber()
  categoryNo: number;

  @IsNumber()
  areaNo: number;

  @IsString()
  note1: string;

  @IsString()
  note2: string;

  @IsString()
  note3: string;
}

export class CreateBoardDto extends BoardContent {
  @IsNumber()
  date: number;
}
export class UpdateBoardDto extends BoardContent {
  @IsNumber()
  date: number;
}
export class SearchBoardDto {
  // @IsString()
  // description: string;
  @IsString()
  sort: 'DESC' | 'ASC';
  // @IsNumber()
  // price1: number;
  // @IsNumber()
  // price2: number;
  // @IsNumber()
  // area: number;
  // @IsNumber()
  // category: number;
  // @IsBoolean()
  // target: boolean;
}
