import { PickType } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class SignUpDto {
  @IsString()
  @Matches(/^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/)
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsNumber()
  school?: number;

  @IsOptional()
  @IsNumber()
  // Matches 사용하여 DB에 있는 전공 값 맞춰보기
  major?: number;

  @IsString()
  phone: string;

  @IsString()
  nickname: string;

  @IsBoolean()
  manager: boolean;

  @IsOptional()
  @IsArray()
  categories?: [];

  @IsArray()
  @IsNotEmpty()
  terms: [];

  @IsString()
  @IsOptional()
  photo_url: string;
}
