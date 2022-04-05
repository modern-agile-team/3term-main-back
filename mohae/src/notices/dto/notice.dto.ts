import { IsNumber, IsString } from 'class-validator';

export class CreateNoticeDto {
  @IsNumber()
  managerNo: number;

  @IsString()
  title: string;

  @IsString()
  description: string;
}
