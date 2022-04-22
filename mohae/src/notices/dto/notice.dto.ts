import { IsNumber, IsOptional, IsString } from 'class-validator';

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
  managerNo: number;

  @IsString()
  title: string;

  @IsString()
  description: string;
}
