import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class SendLetterDto {
  @IsNotEmpty()
  @IsNumber()
  senderNo: number;

  @IsNotEmpty()
  @IsNumber()
  receiverNo: number;

  @IsNotEmpty()
  @IsString()
  description: string;
}
