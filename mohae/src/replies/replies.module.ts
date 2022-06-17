import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from 'src/auth/repository/user.repository';
import { CommentRepository } from 'src/comments/repository/comment.repository';
import { ErrorConfirm } from 'src/common/utils/error';
import { RepliesController } from './replies.controller';
import { RepliesService } from './replies.service';
import { ReplyRepository } from './repository/reply.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ReplyRepository,
      CommentRepository,
      UserRepository,
    ]),
  ],
  controllers: [RepliesController],
  providers: [RepliesService, ErrorConfirm],
})
export class RepliesModule {}
