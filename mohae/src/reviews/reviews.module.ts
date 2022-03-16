import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardsModule } from 'src/boards/boards.module';
import { BoardsService } from 'src/boards/boards.service';
import { BoardRepository } from 'src/boards/repository/board.repository';
import { ReviewRepository } from './repository/review.repository';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ReviewRepository, BoardRepository]),
    BoardsModule,
  ],
  controllers: [ReviewsController],
  providers: [ReviewsService, BoardsService],
})
export class ReviewsModule {}
