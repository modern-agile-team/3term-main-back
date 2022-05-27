import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class CreateSpecDto {
  @IsString()
  title: string;

  @IsString()
  description: string;
}

export class UpdateSpecDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ description: '스펙 제목' })
  title: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: '스펙 본문' })
  description: string;

  @IsOptional()
  @IsArray()
  @ApiProperty({ description: '스펙 사진' })
  specPhoto: [];
}
