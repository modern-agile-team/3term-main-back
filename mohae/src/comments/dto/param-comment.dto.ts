import { IsNotEmpty, IsNumber } from 'class-validator';

export class ParamCommentDto {
  @IsNotEmpty()
  @IsNumber()
  boardNo: any;

  @IsNotEmpty()
  @IsNumber()
  commentNo: any;
}
