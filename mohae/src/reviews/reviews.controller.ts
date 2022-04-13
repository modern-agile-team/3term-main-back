import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateReviewDto } from './dto/review.dto';
import { Review } from './entity/review.entity';
import { ReviewsService } from './reviews.service';

@Controller('reviews')
@ApiTags('Reviews')
export class ReviewsController {
  constructor(private reviewService: ReviewsService) {}

  @ApiOperation({
    summary: '리뷰 전체 조회',
    description: '리뷰 전체 조회 API',
  })
  @Get()
  async readAllReview(): Promise<Review[]> {
    const response = await this.reviewService.readAllReview();

    return Object.assign({
      statusCode: 200,
      msg: `전체 리뷰 조회가 완료되었습니다.`,
      response,
    });
  }

  @ApiOperation({
    summary: '마이페이지에 나타나는 유저 리뷰',
    description: '마이페이지에 나타나는 유저 리뷰 조회 API',
  })
  @Get(':userNo')
  async readUserReviews(@Param('userNo') no: number) {
    const response = await this.reviewService.readUserReviews(no);

    return Object.assign({
      statusCode: 200,
      msg: `${no} 유저의 리뷰가 조회되었습니다.`,
      response,
    });
  }

  @ApiOperation({
    summary: '리뷰 작성',
    description: '리뷰 작성 API',
  })
  @Post()
  async createReview(
    @Body() createReviewDto: CreateReviewDto,
  ): Promise<Review> {
    const response = await this.reviewService.createReview(createReviewDto);

    return Object.assign({
      statusCode: 201,
      msg: '리뷰 생성이 완료되었습니다.',
      response,
    });
  }
}
