import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewRepository } from 'src/reviews/repository/review.repository';
import { ReviewsModule } from 'src/reviews/reviews.module';
import { BoardsController } from './boards.controller';
import { BoardsService } from './boards.service';
import { BoardRepository } from './repository/board.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([BoardRepository, ReviewRepository]),
    ReviewsModule,
  ],
  controllers: [BoardsController],
  providers: [BoardsService],
})
export class BoardsModule {}
