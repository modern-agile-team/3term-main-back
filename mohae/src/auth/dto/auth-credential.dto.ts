import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
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
