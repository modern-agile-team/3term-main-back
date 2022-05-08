import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';

export class CreateFaqDto {
  @ApiProperty({
    example: 1,
    description: '생성한 관리자 번호',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  managerNo: number;

  @ApiProperty({
    example: 'FAQ 제목',
    description: 'FAQ 제목',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'FAQ 내용',
    description: 'FAQ 내용',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  description: string;
}

export class UpdateFaqDto {
  @ApiProperty({
    example: 2,
    description: '수정한 관리자 번호',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  modifiedManagerNo: number;

  @ApiProperty({
    example: '수정한 FAQ 제목',
    description: '수정한 FAQ 제목',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: '수정한 FAQ 내용',
    description: '수정한 FAQ 내용',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  description: string;
}
