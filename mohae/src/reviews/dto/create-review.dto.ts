import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Review } from '../entity/review.entity';

export class CreateReviewDto extends PickType(Review, [
  'description',
  'rating',
] as const) {
  @IsNotEmpty()
  @IsNumber()
  boardNo: number;
}
