import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateSpecDto {
  @ApiProperty({
    example: '변경된 스펙 제목',
    description: '변경할 스펙 제목',
    required: false,
  })
  @IsOptional()
  @IsString()
  @ApiProperty({ description: '스펙 제목' })
  title: string;

  @ApiProperty({
    example: '변경된 스펙 본문',
    description: '변경할 스펙 본문',
    required: false,
  })
  @IsOptional()
  @IsString()
  @ApiProperty({ description: '스펙 본문' })
  description: string;
}
