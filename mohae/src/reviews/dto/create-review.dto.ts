import { IsNumber, IsString } from 'class-validator';

export class CreateReviewDto {
  @IsNumber()
  readonly boardNo: number;

  // @IsNumber()
  // reviewerNo: number;

  @IsString()
  readonly description: string;

  @IsNumber()
  readonly rating: number;
}
