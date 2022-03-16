import { IsNumber, IsString } from 'class-validator';

export class UpdateProfileDto {
  @IsString()
  phone?: string;

  @IsString()
  nickname?: string;

  @IsNumber()
  school?: number;

  @IsNumber()
  major?: number;

  @IsString()
  photo_url?: string;
}
