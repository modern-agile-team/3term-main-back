import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';
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
}
