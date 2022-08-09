import { ApiProperty, PickType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateBoardDto {
  @ApiProperty({
    example: 10000,
    description: 'Example price입니다.',
    required: true,
  })
  @Transform(({ value }) => JSON.parse(value))
  @IsNumber()
  price: number;

  @ApiProperty({
    example: '제목 입력',
    description: 'Example title입니다.',
    required: true,
  })
  @Transform(({ value }) => JSON.parse(value))
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(16)
  title: string;

  @ApiProperty({
    example: '내용 입력',
    description: 'Example Description입니다.',
    required: true,
  })
  @Transform(({ value }) => JSON.parse(value))
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  description: string;

  @ApiProperty({
    example: '한줄 요약 입력',
    description: 'Example summary입니다.',
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => JSON.parse(value))
  @IsString()
  @MaxLength(100)
  summary?: string;

  @ApiProperty({
    example: true,
    description: 'Example false = 해주는 사람, true = 구하는 사람.',
    required: true,
  })
  @Transform(({ value }) => JSON.parse(value))
  @IsBoolean()
  target: boolean;

  @ApiProperty({
    example: 3,
    description: 'Example 카테고리.',
    required: true,
  })
  @Transform(({ value }) => JSON.parse(value))
  @IsNumber()
  categoryNo: number;

  @ApiProperty({
    example: 1,
    description: 'Example 지역.',
    required: true,
  })
  @Transform(({ value }) => JSON.parse(value))
  @IsNumber()
  areaNo: number;

  @ApiProperty({
    example: 0,
    description: 'Example 마감일 0 = 상시, 7 = 일주일, 30 = 1개월, 60 = 3개월',
    required: true,
  })
  @Transform(({ value }) => JSON.parse(value))
  @IsNumber()
  deadline: number;

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
