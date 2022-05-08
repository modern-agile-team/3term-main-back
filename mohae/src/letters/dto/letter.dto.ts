import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

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
  @MaxLength(500)
  description: string;
}
