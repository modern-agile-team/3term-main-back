import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { Review } from '../entity/review.entity';

export class CreateReviewDto extends PickType(Review, [
  'description',
  'rating',
] as const) {
  @ApiProperty({
    example: 27,
    description: '리뷰를 남길 게시글 입니다.',
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  boardNo: number;

  @ApiProperty({
    example: 3,
    description: '리뷰를 남길 유저 입니다.',
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  reviewerNo: number;
}
