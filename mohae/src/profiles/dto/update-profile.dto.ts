import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateProfileDto {
  @ApiProperty({
    example: '01000000000' || null,
    description: '변경된 phone 넘버',
    required: false,
  })
  @IsOptional()
  @IsString()
  phone: string;

  @ApiProperty({
    example: 'subro' || null,
    description: '변경된 nickname',
    required: false,
  })
  @IsOptional()
  @IsString()
  nickname: string;

  @ApiProperty({
    example: 1 || null,
    description: '변경된 학교 고유 번호',
    required: false,
  })
  @IsOptional()
  // @IsNumber()
  @IsString()
  // school: number;
  school: string | number;

  @ApiProperty({
    example: 1 || null,
    description: '변경된 전공 고유 번호',
    required: false,
  })
  @IsOptional()
  @IsString()
  // @IsNumber()
  // major: number;
  major: string | number;

  @ApiProperty({
    example: [1, 2, 3] || null,
    description: '변경된 관심사 고유 번호가 담긴 배열',
    required: false,
  })
  @IsOptional()
  // @IsArray()
  @IsString()
  // categories: [];
  categories: any;
}
