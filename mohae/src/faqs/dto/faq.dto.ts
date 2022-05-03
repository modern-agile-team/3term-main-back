import { IsNumber, IsString } from 'class-validator';

export class CreateFaqDto {
  @IsString()
  title: string;

  @IsNumber()
  managerNo: number;

  @IsString()
  description: string;
}

export class UpdateFaqDto {
  @IsString()
  title: string;

  @IsNumber()
  modifiedManagerNo: number;

  @IsString()
  description: string;
}
