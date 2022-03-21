import { IsNumber, IsString } from 'class-validator';

export abstract class CreateReportDto {
  @IsString()
  head: string;

  @IsNumber()
  headNo: number;

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
