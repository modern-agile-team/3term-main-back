import { EntityRepository, Repository } from 'typeorm';
import { Review } from '../entity/review.entity';

@EntityRepository(Review)
export class ReviewRepository extends Repository<Review> {}
