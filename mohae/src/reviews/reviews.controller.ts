import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from 'src/auth/entity/user.entity';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { SuccesseInterceptor } from 'src/common/interceptors/success.interceptor';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewsService } from './reviews.service';

@Controller('reviews')
@UseGuards(AuthGuard())
@UseInterceptors(SuccesseInterceptor)
@ApiTags('Reviews')
export class ReviewsController {
  constructor(private reviewService: ReviewsService) {}

  @ApiOperation({
    summary: '마이페이지에 나타나는 유저 리뷰',
    description: '마이페이지에 나타나는 유저 리뷰 조회 API',
  })
  @HttpCode(200)
  @Get('/:targetUserNo')
  async readUserReviews(
    @Param('targetUserNo') targetUserNo: number,
  ): Promise<object> {
    const response: object | undefined =
      await this.reviewService.readUserReviews(targetUserNo);

    if (!response) {
      return {
        msg: '유저의 리뷰가 존재하지 않습니다.',
      };
    }

    return {
      msg: '유저의 리뷰가 조회되었습니다.',
      response,
    };
  }

  @ApiOperation({
    summary: '리뷰 작성',
    description: '리뷰 작성 API',
  })
  @HttpCode(201)
  @Post()
  async createReview(
    @CurrentUser() reviewer: User,
    @Body() createReviewDto: CreateReviewDto,
  ) {
    await this.reviewService.createReview(reviewer, createReviewDto);

    return {
      msg: '리뷰 생성이 완료되었습니다.',
    };
  }

  @Get('/check/:targetUserNo/:boardNo')
  @HttpCode(200)
  async checkDuplicateReview(
    @CurrentUser() requester: User,
    @Param('targetUserNo') targetUserNo: number,
    @Param('boardNo') boardNo: number,
  ): Promise<object> {
    await this.reviewService.checkDuplicateReview(
      requester,
      targetUserNo,
      boardNo,
    );

    return {
      msg: '중복된 리뷰가 없습니다.',
    };
  }
}
