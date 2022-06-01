import { IsString } from 'class-validator';

export class SignDownDto {
  @IsString()
  email: string;
}
