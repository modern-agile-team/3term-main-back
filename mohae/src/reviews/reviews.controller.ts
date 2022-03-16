import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
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

  @Post()
  createReview(@Body() createReviewDto: CreateReviewDto) {
    this.reviewService.createReview(createReviewDto);
  }
}
