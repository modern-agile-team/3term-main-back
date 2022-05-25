import { UploadedFile } from '@nestjs/common';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateSpecDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  // @IsArray()
  // specPhoto: [];

  // @IsNumber()
  // userNo: number;
}

export class UpdateSpecDto {
  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsArray()
  specPhoto: [];
}
