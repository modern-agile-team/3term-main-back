import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from 'src/auth/entity/user.entity';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { SuccesseInterceptor } from 'src/common/interceptors/success.interceptor';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewsService } from './reviews.service';

@UseGuards(AuthGuard('jwt'))
@UseInterceptors(SuccesseInterceptor)
@ApiTags('Reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private reviewService: ReviewsService) {}

  @ApiOperation({
    summary: '프로필 페이지에서 유저에게 달린 리뷰를 불러오는 API',
    description: '프로필 주인에게 달린 리뷰를 불러온다.',
  })
  @ApiOkResponse({
    description: '프로필 리뷰 조회에 성공한 경우.',
  })
  @HttpCode(200)
  @Get('profile')
  async readUserReview(
    @Query('user') userNo: number,
    @Query('take') take: number,
    @Query('page') page: number,
  ) {
    const response: object = await this.reviewService.readUserReviews(
      userNo,
      take,
      page,
    );

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

  @ApiOperation({
    summary: '중복된 리뷰 체크',
    description: '리뷰룰 요청하는 유저와 대상 유저의 리뷰 여부를 판단',
  })
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
