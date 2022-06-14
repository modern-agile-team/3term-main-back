import { IsNotEmpty, IsNumber } from 'class-validator';

export class ParamCommentDto {
  @IsNotEmpty()
  @IsNumber()
  boardNo: number;

  @IsNotEmpty()
  @IsNumber()
  commentNo: number;
}
