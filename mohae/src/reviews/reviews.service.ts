import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BoardRepository } from 'src/boards/repository/board.repository';
import { CreateReviewDto } from './dto/create-review.dto';
import { Review } from './entity/review.entity';
import { ReviewRepository } from './repository/review.repository';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(ReviewRepository)
    private reviewRepository: ReviewRepository,

    @InjectRepository(BoardRepository)
    private boardsRepository: BoardRepository,
  ) {}

  async findAllReview(): Promise<Review[]> {
    try {
      const reviews = await this.reviewRepository.findAllReview();

      return reviews;
    } catch (e) {
      throw e;
    }
  }

  async findOneReview(no: number): Promise<Review> {
    try {
      const review = await this.reviewRepository.findOneReview(no);

      if (!review) {
        throw new NotFoundException(
          `${no}에 해당하는 리뷰를 찾을 수 없습니다.`,
        );
      }

      return review;
    } catch (e) {
      throw e;
    }
  }

  async createReview(createReviewDto: CreateReviewDto): Promise<Review> {
    const { boardNo } = createReviewDto;
    try {
      const board = await this.boardsRepository.findOne(boardNo, {
        relations: ['reviews'],
      });

      if (!board) {
        throw new NotFoundException(
          `No: ${boardNo} 게시글이 존재하지 않습니다.`,
        );
      }

      const review = await this.reviewRepository.createReview(createReviewDto);

      board.reviews.push(review);

      await this.boardsRepository.save(board);
      return review;
    } catch (e) {
      throw e;
    }
  }
}
