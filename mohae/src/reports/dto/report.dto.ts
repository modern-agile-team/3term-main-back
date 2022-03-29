import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';

export abstract class CreateReportDto {
  @ApiProperty({
    example: 'user',
    description: '신고 대상 항목입니다. (user or board)',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  head: string;

  @ApiProperty({
    example: 3,
    description: '헤드에 넘버입니다. (게시글 넘버 또는 유저 넘버)',
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  headNo: number;

  @ApiProperty({
    example: 5,
    description: '신고자 넘버입니다.',
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
  @ArrayNotEmpty()
  @ArrayMaxSize(3)
  checks: [];

  @ApiProperty({
    example: '짜증나 죽겠어요.',
    description: '신고 내용입니다.',
    required: true,
  })
  @IsString()
  description: string;
}
