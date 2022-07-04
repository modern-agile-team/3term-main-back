import { IsString } from 'class-validator';

export class SendEmailDto {
  @IsString()
  name: string;

  @IsString()
  email: string;
}
