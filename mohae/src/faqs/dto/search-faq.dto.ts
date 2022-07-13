import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Faq } from '../entity/faq.entity';

export class SearchFaqsDto extends PickType(Faq, ['title'] as const) {
  @ApiProperty({
    example: '3',
    description: '불러올 개수',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  take: string;

  @ApiProperty({
    example: '1',
    description: '불러올 페이지 수',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  page: string;
}
