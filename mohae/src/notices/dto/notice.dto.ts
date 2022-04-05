import { IsNumber, IsString } from 'class-validator';

export class CreateNoticeDto {
  @IsNumber()
  managerNo: number;

  @IsString()
  title: string;

  @IsString()
  description: string;
}

export class UpdateNoticeDto {
  @IsNumber()
  modifiedManagerNo: number;

  @IsString()
  title: string;

  @IsString()
  description: string;
}
