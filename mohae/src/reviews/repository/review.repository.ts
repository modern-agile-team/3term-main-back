import { InternalServerErrorException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { CreateReviewDto } from '../dto/create-review.dto';
import { Review } from '../entity/review.entity';

@EntityRepository(Review)
export class ReviewRepository extends Repository<Review> {
  async createReview(createReviewDto: CreateReviewDto): Promise<Review> {
    const { reviewerNo, description, rating } = createReviewDto;

    try {
      const createdReview = this.create({
        reviewer: reviewerNo,
        description,
        rating,
      });

      return await createdReview.save();
    } catch (e) {
      throw new InternalServerErrorException(
        `${e} ### 리뷰 작성 : 알 수 없는 서버 에러입니다.`,
      );
    }
  }

  async findAllReview(): Promise<Review[]> {
    try {
      const reviews = await this.createQueryBuilder('reviews')
        .leftJoinAndSelect('reviews.board', 'boards')
        .where('reviews.board = boards.no')
        .getMany();

      return reviews;
    } catch (e) {
      throw new InternalServerErrorException(
        `${e} ### 리뷰 전체 조회 : 알 수 없는 서버 에러입니다.`,
      );
    }
  }

  async findOneReview(no: number): Promise<Review> {
    try {
      const review = await this.createQueryBuilder('reviews')
        .leftJoinAndSelect('reviews.board', 'boards')
        .where('reviews.no = :no', { no })
        .getOne();

      return review;
    } catch (e) {
      throw new InternalServerErrorException(
        `${e} ### 리뷰 선택 조회 : 알 수 없는 서버 에러입니다.`,
      );
    }
  }
}
