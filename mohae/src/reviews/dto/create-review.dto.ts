import { IsNumber, IsString } from 'class-validator';

export class CreateReviewDto {
  @IsNumber()
  reviewerNo: number;

  @IsString()
  description: string;

  @IsNumber()
  rating: number;
}
