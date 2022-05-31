import { IsBoolean, IsNumber } from 'class-validator';

export class BasketDto {
  @IsNumber()
  userNo: number;

  @IsNumber()
  boardNo: number;
}
