import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateBoardDto {
  @ApiProperty({
    example: '1000',
    description: '가격이 변동 될 경우 값 입력 | 변동이 안될 경우 null',
    required: true,
  })
  @IsOptional()
  @IsString()
  price?: string;

  @ApiProperty({
    example: 'test',
    description: '제목이 변동 될 경우 값 입력 | 변동이 안될 경우 null',
    required: true,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(15)
  title?: string;

  @ApiProperty({
    example: '내용',
    description: '내용이 변동 될 경우 값 입력 | 변동이 안될 경우 null',
    required: true,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  description?: string;

  @ApiProperty({
    example: '한줄 요약',
    description: '한줄요약이 변동 될 경우 값 입력 | 변동이 안될 경우 null',
    required: true,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  summary?: string;

  @ApiProperty({
    example: 'true',
    description: 'target이 변동 될 경우 값 입력 | 변동이 안될 경우 null',
    required: true,
  })
  @IsOptional()
  @IsString()
  target?: string;

  @ApiProperty({
    example: '2',
    description: '카테고리가 변동 될 경우 값 입력 | 변동이 안될 경우 null',
    required: true,
  })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({
    example: '3',
    description: '지역이 변동 될 경우 값 입력 | 변동이 안될 경우 null',
    required: true,
  })
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

  @ApiProperty({
    example: '0',
    description:
      '마감일이 변동 될 경우 값 입력 0 = 상시 | 변동이 안될 경우 null',
    required: true,
  })
  @IsOptional()
  @IsString()
  deadline?: any;
}
