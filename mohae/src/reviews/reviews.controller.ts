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
import { BoardsService } from 'src/boards/boards.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { Review } from './entity/review.entity';
import { ReviewsService } from './reviews.service';

@Controller('reviews')
@ApiTags('Reviews')
export class ReviewsController {
  constructor(private reviewService: ReviewsService) {}

  @Get()
  findAll(): Promise<Review[]> {
    return this.reviewService.findAll();
  }

  @Get(':no')
  findOne(@Param('no') no: number): Promise<Review> {
    return this.reviewService.findOne(no);
  }

  @Patch(':no')
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
