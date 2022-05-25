import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { Review } from '../entity/review.entity';

export class CreateReviewDto extends PickType(Review, [
  'description',
  'rating',
] as const) {
  @IsNotEmpty()
  @IsNumber()
  board: any;
}
