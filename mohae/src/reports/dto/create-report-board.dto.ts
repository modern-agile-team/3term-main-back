import { IsNumber, IsString } from 'class-validator';

export class CreateReportBoardDto {
  @IsNumber()
  boardNo: number;

  @IsNumber()
  reportUserNo: number;

  @IsNumber()
  firstNo: number;

  @IsNumber()
  secondNo: number;

  @IsNumber()
  thirdNo: number;

  @IsString()
  description: string;
}
