import { IsNumber, IsString } from 'class-validator';

export class CreateReviewDto {
  @IsNumber()
  boardNo: number;

  @IsNumber()
  reviewerNo: number;

  @IsString()
  description: string;

  @IsNumber()
  rating: number;
}
