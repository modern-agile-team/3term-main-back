import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Faq } from '../entity/faq.entity';

export class SearchFaqsDto extends PickType(Faq, ['title'] as const) {
  @ApiProperty({
    example: '5',
    description:
      '불러올 개수, 초기값은 5이며 추가 로딩시 +3 해서 보내면 됩니다.',
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
