import { IsBoolean, IsNumber, IsString, Matches } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Matches(/^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/)
  email: string;

  @IsString()
  password: string;

  @IsString()
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
