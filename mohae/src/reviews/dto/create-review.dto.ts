import { IsNumber, IsString } from 'class-validator';

export class CreateReviewDto {
  @IsNumber()
  board_no: number;

  @IsNumber()
  reviewer_no: number;

  @IsString()
  description: string;

  @IsNumber()
  rating: number;
}
