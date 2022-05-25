import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Review } from '../entity/review.entity';
// extends PickType(Review, [
//   'description',
//   'rating',
// ] as const)
export class CreateReviewDto {
  @IsNotEmpty()
  @IsNumber()
  board: number;

  @IsNotEmpty()
  @IsNumber()
  rating: number;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  reviewer: number;
}
