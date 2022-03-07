import { IsNumber, IsString } from 'class-validator';

export class CreateReportBoardDto {
  @IsNumber()
  board_no: number;

  @IsNumber()
  report_user_no: number;

  @IsNumber()
  first_no: number;

  @IsNumber()
  second_no: number;

  @IsNumber()
  third_no: number;

  @IsString()
  description: string;
}
