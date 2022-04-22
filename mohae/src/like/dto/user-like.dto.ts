import { IsBoolean, IsNumber } from 'class-validator';

export class LikeUserDto {
  @IsNumber()
  userNo?: number;

  @IsNumber()
  likedUserNo?: number;

  @IsBoolean()
  judge: boolean;
}
