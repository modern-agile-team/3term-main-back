import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
} from 'class-validator';

export class CreateUserDto {
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

  @IsNumber()
  school: number;

  @IsNumber()
  major: number;

  @IsString()
  phone: string;

  @IsString()
  nickname: string;

  @IsBoolean()
  manager: boolean;

  @IsString()
  photo_url: string;

  @IsArray()
  categories: [];
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
  @Matches(/^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/)
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
  @Matches(/^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/)
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  changePassword: string;

  @IsString()
  @IsNotEmpty()
  confirmChangePassword: string;
}
