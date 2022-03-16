import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from 'src/boards/entity/board.entity';
import { BoardRepository } from 'src/boards/repository/board.repository';
import { CreateReviewDto } from './dto/create-review.dto';
import { Review } from './entity/review.entity';
import { ReviewRepository } from './repository/review.repository';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(ReviewRepository)
    private reviewRepository: ReviewRepository,

    private boardsRepository: BoardRepository,
  ) {}

  async findAll(): Promise<Review[]> {
    const query = this.reviewRepository.createQueryBuilder('reviews');
    const reviews = await query.getMany();

    return reviews;
  }

  async findOne(no: number): Promise<Review> {
    return await this.reviewRepository.findOne(no);
  }

  async createReview(
    no: number,
    createReviewDto: CreateReviewDto,
  ): Promise<Review> {
    const board = await this.boardsRepository.findOne(no, {
      relations: ['reviews'],
    });
    if (!board) {
      throw new NotFoundException(`No: ${no} 게시글이 존재하지 않습니다.`);
    } else {
      const review = await this.reviewRepository.createReview(
        no,
        createReviewDto,
      );

      board.reviews.push(review);

      await this.boardsRepository.save(board);
      return review;
    }
  }
}
