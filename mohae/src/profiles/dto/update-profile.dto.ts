import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  phone: string;

  @IsOptional()
  @IsString()
  nickname: string;

  @IsOptional()
  // @IsNumber()
  @IsString()
  // school: number;
  school: string | number;

  @IsOptional()
  @IsString()
  // @IsNumber()
  // major: number;
  major: string | number;

  @IsOptional()
  // @IsArray()
  @IsString()
  // categories: [];
  categories: any;
}
