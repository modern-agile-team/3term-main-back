import { Controller, Get } from '@nestjs/common';
import { ReviewsService } from './reviews.service';

@Controller('reviews')
export class ReviewsController {
  constructor(private reviewService: ReviewsService) {}

  @Get()
  findAll() {
    return this.reviewService.findAll();
  }
}
