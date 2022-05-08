import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateNoticeDto {
  @ApiProperty({
    example: 1,
    description: '관리자 번호',
    required: true,
  })
  @IsNumber()
  managerNo: number;

  @ApiProperty({
    example: '생성할 공지사항 제목',
    description: '공지사항 제목',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: '생성할 공지사항 내용',
    description: '공지사항 내용',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  description: string;
}

export class UpdateNoticeDto {
  @ApiProperty({
    example: 2,
    description: '수정한 관리자 번호',
    required: true,
  })
  @IsNumber()
  managerNo: number;

  @ApiProperty({
    example: '수정할 공지사항 제목',
    description: '공지사항 제목',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: '수정할 공지사항 내용',
    description: '공지사항 내용',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  description: string;
}
