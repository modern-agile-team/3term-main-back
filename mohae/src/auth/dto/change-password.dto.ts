import { IsNotEmpty, IsString, Matches } from 'class-validator';

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
