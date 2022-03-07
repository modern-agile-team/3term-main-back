import { IsNumber, IsString } from 'class-validator';

export class CreateReportUserDto {
  @IsNumber()
  user_no: number;

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
