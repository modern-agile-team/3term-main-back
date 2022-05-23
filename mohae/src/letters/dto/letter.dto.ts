import { ApiProperty, PickType } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { Letter } from '../entity/letter.entity';

export class SendLetterDto extends PickType(Letter, [
  'receiver',
  'description',
] as const) {
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
  description: string;
}
