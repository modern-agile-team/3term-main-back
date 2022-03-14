import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class CreateReviewDto {
  @IsNumber()
  thumb: number;

  @IsNumber()
  hit: number;

  @IsNumber()
  price: number;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  summary: string;

  @IsBoolean()
  target: boolean;
}
