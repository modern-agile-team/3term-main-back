import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateProfileDto {
  @ApiProperty({
    example: '01000000000' || null,
    description: '변경된 phone 넘버',
    required: false,
  })
  @Transform(({ value }) => JSON.parse(value))
  @IsOptional()
  @IsString()
  phone: string;

  @ApiProperty({
    example: 'subro' || null,
    description: '변경된 nickname',
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => JSON.parse(value))
  @IsString()
  nickname: string;

  @ApiProperty({
    example: 1 || null,
    description: '변경된 학교 고유 번호',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => JSON.parse(value))
  school: number;

  @ApiProperty({
    example: 1 || null,
    description: '변경된 전공 고유 번호',
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => JSON.parse(value))
  @IsNumber()
  major: number;

  @ApiProperty({
    example: [1, 2, 3] || null,
    description: '변경된 관심사 고유 번호가 담긴 배열',
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => JSON.parse(value))
  @IsArray()
  categories: [];
}
