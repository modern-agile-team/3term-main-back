import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class CreateBoardDto {
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

  @IsNumber()
  category: number

  @IsNumber()
  area: number
}
