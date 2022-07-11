import { IsString } from 'class-validator';

export class QuestionEmailDto {
  @IsString()
  title: string;

  @IsString()
  description: string;
}
