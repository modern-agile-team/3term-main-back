import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSpecDto {
  @ApiProperty({
    example: '스펙 제목',
    description: '스펙 제목',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ title: '스펙 제목' })
  title: string;

  @ApiProperty({
    example: '스펙 본문',
    description: '스펙 본문',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: '스펙 본문' })
  description: string;
}
