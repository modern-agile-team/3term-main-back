import { IsArray, IsNumber, IsString } from 'class-validator';

export abstract class CreateReportDto {
  @IsString()
  head: string;

  @IsNumber()
  headNo: number;

  @IsNumber()
  reportUserNo: number;

  @IsArray()
  checks: [];

  @IsString()
  description: string;
}
