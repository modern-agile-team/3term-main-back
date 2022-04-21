import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { UserRepository } from 'src/auth/repository/user.repository';
import { ErrorConfirm } from 'src/utils/error';
import { LikeController } from './like.controller';
import { LikeService } from './like.service';
import { LikeRepository } from './repository/like.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRepository, LikeRepository]),
    AuthModule,
  ],
  controllers: [LikeController],
  providers: [LikeService, ErrorConfirm],
})
export class LikeModule {}
