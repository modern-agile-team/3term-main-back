import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';
import { Letter } from '../entity/letter.entity';

export class SendLetterDto {
  @ApiProperty({
    example: null,
    description: '쪽지함이 존재하지 않을 경우 null, 있으면 mailboxNo',
    required: true,
  })
  @IsOptional()
  @IsString()
  mailboxNo: string;

  @IsOptional()
  @IsString()
  @MaxLength(500, { message: '500자 이내로 작성해 주세요.' })
  description: string;

  @IsOptional()
  @IsString()
  receiverNo: string;
}
