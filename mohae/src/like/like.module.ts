import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { UserRepository } from 'src/auth/repository/user.repository';
import { BoardsModule } from 'src/boards/boards.module';
import { BoardRepository } from 'src/boards/repository/board.repository';
import { ErrorConfirm } from 'src/common/utils/error';
import { LikeController } from './like.controller';
import { LikeService } from './like.service';
import { BoardLikeRepository } from './repository/like.repository';
import { LikeRepository } from './repository/like.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserRepository,
      LikeRepository,
      BoardRepository,
      BoardLikeRepository,
    ]),
    AuthModule,
  ],
  controllers: [LikeController],
  providers: [LikeService, ErrorConfirm],
})
export class LikeModule {}
