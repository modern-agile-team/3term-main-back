import { IsArray, IsNumber, IsString } from 'class-validator';

export class UpdateProfileDto {
  @IsString()
  phone?: string;

  @IsString()
  nickname?: string;

  @IsNumber()
  school?: number;

  @IsNumber()
  major?: number;

  @IsArray()
  categories: [];

  @IsString()
  photo_url?: string;
}
