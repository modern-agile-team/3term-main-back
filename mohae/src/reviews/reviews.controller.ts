import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateReviewDto } from './dto/create-review.dto';
import { Review } from './entity/review.entity';
import { ReviewsService } from './reviews.service';

@Controller('reviews')
@ApiTags('Reviews')
export class ReviewsController {
  constructor(private reviewService: ReviewsService) {}

  @Get()
  async findAllReview(): Promise<Review[]> {
    const response = await this.reviewService.findAllReview();

    return Object.assign({
      statusCode: 200,
      msg: `전체 리뷰 조회가 완료되었습니다.`,
      response,
    });
  }

  @Get(':no')
  async findOneReview(@Param('no') no: number): Promise<Review> {
    const response = await this.reviewService.findOneReview(no);

    return Object.assign({
      statusCode: 200,
      msg: `${no}번 리뷰가 조회되었습니다.`,
      response,
    });
  }

  @Post(':no')
  async createReview(
    @Param('no', ParseIntPipe) no: number,
    @Body() createReviewDto: CreateReviewDto,
  ): Promise<Review> {
    const response = await this.reviewService.createReview(no, createReviewDto);

    return Object.assign({
      statusCode: 201,
      msg: '리뷰 생성이 완료되었습니다.',
      response,
    });
  }
}
