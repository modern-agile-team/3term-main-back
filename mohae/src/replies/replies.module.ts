import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RepliesController } from './replies.controller';
import { RepliesService } from './replies.service';
import { ReplyRepository } from './repository/reply.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ReplyRepository])],
  controllers: [RepliesController],
  providers: [RepliesService],
})
export class RepliesModule {}
