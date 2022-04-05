import { IsNumber, IsString } from 'class-validator';

export class CreateSpecDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  photo_url?: string;

  @IsNumber()
  userNo: number;
}
