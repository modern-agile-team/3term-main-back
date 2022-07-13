import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class QuestionEmailDto {
  @ApiProperty({
    example: '문의사항 제목',
    description: 'question title',
    required: true,
  })
  @IsString()
  title: string;

  @ApiProperty({
    example: '문의사항 내용',
    description: 'question description',
    required: true,
  })
  @IsString()
  description: string;
}
