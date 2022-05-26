import { ApiProperty, PickType } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateReportDto {
  @ApiProperty({
    example: 'user',
    description: '신고 대상 항목입니다. (user or board)',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  head: 'user' | 'board';

  @ApiProperty({
    example: 3,
    description: '헤드 번호입니다. (게시글 넘버 또는 유저 넘버)',
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  headNo: number;

  @ApiProperty({
    example: 5,
    description: '신고자 번호입니다.',
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  reportUserNo: number;

  @ApiProperty({
    example: [1, 3, 6],
    description: '체크된 신고 체크박스 넘버입니다.',
    required: true,
  })
  @IsArray()
  @ArrayMaxSize(3)
  @IsOptional()
  checks?: Array<number>;

  @ApiProperty({
    example: '짜증나 죽겠어요.',
    description: '신고 내용입니다.',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  description: string;
}
