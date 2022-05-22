import { PickType } from '@nestjs/swagger';
import { Faq } from '../entity/faq.entity';

export class CreateFaqDto extends PickType(Faq, [
  'title',
  'description',
] as const) {}
