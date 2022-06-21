import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class ExampleType {
  @IsNotEmpty()
  @IsBoolean()
  success: boolean;

  @IsNotEmpty()
  @IsNumber()
  statusCode: number;

  @IsNotEmpty()
  @IsString()
  msg: string;

  @IsOptional()
  response?: any;

  @IsOptional()
  @IsString()
  err?: string;
}
