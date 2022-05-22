import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { Faq } from '../entity/faq.entity';

export class CreateFaqDto extends PickType(Faq, [
  'managerNo',
  'title',
  'description',
] as const) {}
