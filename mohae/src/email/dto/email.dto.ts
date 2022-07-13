import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SendEmailDto {
  @ApiProperty({
    example: '100_sb99',
    description: 'user nickName',
    required: true,
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: '???@???.com',
    description: 'user email',
    required: true,
  })
  @IsString()
  email: string;
}
