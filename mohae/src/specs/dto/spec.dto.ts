import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class CreateSpecDto {
  @IsString()
  @ApiProperty({ description: '스펙 제목' })
  title: string;

  @IsString()
  @ApiProperty({ description: '스펙 제목' })
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
}
