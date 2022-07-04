import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsEmail()
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
  @IsString()
  photo_url?: string;

  @IsOptional()
  @IsArray()
  categories?: [];

  @IsArray()
  @IsNotEmpty()
  terms: [];
}

export class SignInDto {
  @IsString()
  email: string;

  @IsString()
  password: string;
}

export class SignDownDto {
  @IsString()
  email: string;
}

export class ChangePasswordDto {
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  nowPassword: string;

  @IsString()
  @IsNotEmpty()
  changePassword: string;

  @IsString()
  @IsNotEmpty()
  confirmChangePassword: string;
}

export class ForgetPasswordDto {
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  changePassword: string;

  @IsString()
  @IsNotEmpty()
  confirmChangePassword: string;
}
