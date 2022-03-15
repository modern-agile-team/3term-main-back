import { IsBoolean, IsNumber, IsString } from 'class-validator';
import { School } from 'src/schools/entity/school.entity';

export class CreateUserDto {
  @IsString()
  email: string;

  @IsString()
  password: string;

  @IsString()
  name: string;

  @IsNumber()
  school: School;

  @IsString()
  major_no: number;

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
