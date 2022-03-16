import { IsNumber, IsString } from 'class-validator';

export abstract class CreateReportDto {
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
