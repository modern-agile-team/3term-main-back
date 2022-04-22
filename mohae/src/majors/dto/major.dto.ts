import { IsNumber, IsString } from 'class-validator';

export class MajorDto {
  @IsNumber()
  no: number;

  @IsString()
  name: String;
}
