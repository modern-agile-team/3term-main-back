import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  nickname?: string;

  @IsOptional()
  @IsNumber()
  school?: number;

  @IsOptional()
  @IsNumber()
  major?: number;

  @IsOptional()
  @IsArray()
  categories: [];
}

export class JudgeDuplicateNicknameDto {
  @IsOptional()
  @IsNumber()
  no?: number;

  @IsString()
  nickname?: string;
}
