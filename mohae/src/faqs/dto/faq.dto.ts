import { IsString } from 'class-validator';

export class FaqDto {
  @IsString()
  title: string;

  @IsString()
  description: string;
}
