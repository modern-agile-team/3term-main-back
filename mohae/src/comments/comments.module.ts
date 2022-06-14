import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { CommentRepository } from './repository/comment.repository';

@Module({
  imports: [TypeOrmModule.forFeature([CommentRepository])],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
