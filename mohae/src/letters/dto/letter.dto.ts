import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class SendLetterDto {
  @IsNotEmpty()
  @IsNumber()
  senderNo: number;

  @IsNotEmpty()
  @IsNumber()
  receiverNo: number;

  @IsOptional()
  @IsNumber()
  mailboxNo?: number;

  @IsNotEmpty()
  @IsString()
  description: string;
}
