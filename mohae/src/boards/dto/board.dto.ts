import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDate, IsNotEmpty, IsNumber, IsString, MaxLength, MinLength, minLength } from 'class-validator';

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
  @MaxLength(100)
  note1: string;

  @IsString()
  @MaxLength(100)
  note2: string;

  @IsString()
  @MaxLength(100)
  note3: string;
}

export class CreateBoardDto extends BoardContent {
  @IsNumber()
  deadline: number;

  @IsNumber()
  userNo: number;
}

export class UpdateBoardDto extends BoardContent {
  @IsNumber()
  deadline: number;
}

export class SearchBoardDto {
  @IsString()
  @MaxLength(20)
  title: string;
}

export class ThumbBoardDto {
  @IsNumber()
  boardNo: number;

  @IsNumber()
  userNo: number;

  @IsBoolean()
  judge: boolean;
}