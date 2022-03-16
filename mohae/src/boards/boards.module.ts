import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewRepository } from 'src/reviews/repository/review.repository';
import { BoardsController } from './boards.controller';
import { BoardsService } from './boards.service';
import { BoardRepository } from './repository/board.repository';

@Module({
  imports: [TypeOrmModule.forFeature([BoardRepository, ReviewRepository])],
  controllers: [BoardsController],
  providers: [BoardsService],
})
export class BoardsModule {}
