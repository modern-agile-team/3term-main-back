import { IsNumber, IsOptional, IsString } from 'class-validator';

export class JudgeDuplicateNicknameDto {
  @IsOptional()
  @IsNumber()
  no?: number;

  @IsString()
  nickname?: string;
}
