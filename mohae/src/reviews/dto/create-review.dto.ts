import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Review } from '../entity/review.entity';

export class CreateReviewDto extends PickType(Review, [
  'description',
  'rating',
] as const) {
  @IsNotEmpty({
    message: '리뷰룰 남길 게시글 고유 번호를 입력해 주세요.',
  })
  @IsNumber()
  boardNo: number;

  @IsNotEmpty({
    message: '리뷰를 남길 유저의 고유 번호를 입력해 주세요.',
  })
  @IsNumber()
  targetUserNo: number;
}
