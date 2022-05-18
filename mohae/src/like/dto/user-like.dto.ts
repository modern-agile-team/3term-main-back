import { IsBoolean, IsNumber } from 'class-validator';

export class LikeUserDto {
  @IsNumber()
  userNo?: number;

  @IsNumber()
  likedUserNo?: number;

  @IsBoolean()
  judge: boolean;
}

export class LikeBoardDto {
  @IsNumber()
  userNo: number;

  @IsNumber()
  boardNo: number;

  @IsBoolean()
  judge: boolean;
}
