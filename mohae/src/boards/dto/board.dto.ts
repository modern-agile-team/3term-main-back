import { IsBoolean, IsNumber, IsString } from 'class-validator';

export abstract class BoardContent {
  @IsNumber()
  price: number;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  summary?: string;

  @IsBoolean()
  target: boolean;

  @IsNumber()
  category: number;

  @IsNumber()
  area: number;
}

export class CreateBoardDto extends BoardContent {}
export class UpdateBoardDto extends BoardContent {}
