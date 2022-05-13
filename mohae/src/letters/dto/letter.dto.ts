import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class SendLetterDto {
  @ApiProperty({
    example: 1,
    description: '쪽지 보낸 유저 번호',
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  senderNo: number;

  @ApiProperty({
    example: 2,
    description: '쪽지 받은 유저 번호',
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  receiverNo: number;

  @ApiProperty({
    example: null,
    description: '쪽지함이 존재하지 않을 경우 null, 있으면 mailboxNo',
    required: true,
  })
  @IsOptional()
  @IsNumber()
  mailboxNo?: number;

  @ApiProperty({
    example: '쪽지 내용 전송',
    description: '쪽지 내용',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  description: string;
}
