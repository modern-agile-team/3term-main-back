import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';

/* 
리뷰 생성 DTO
입력 받는 값으로 리뷰를 남길 게시글 번호, 리뷰를 남기는 사람, 내용, 점수가 있음.
*/
export class CreateReviewDto {
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

  @ApiProperty({
    example: '친절하시고 정말 잘해주세요!',
    description: '리뷰의 내용입니다.',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @Length(1, 100)
  description: string;

  @ApiProperty({
    example: 5,
    description: '평점입니다.',
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  rating: number;
}
