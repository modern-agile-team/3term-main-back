import { IsNumber, IsString } from 'class-validator';

export class CreateReportUserDto {
  @IsNumber()
  userNo: number;

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
