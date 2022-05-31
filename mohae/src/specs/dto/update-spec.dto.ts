import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

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
