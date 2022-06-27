import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AreasModule } from 'src/areas/areas.module';
import { AreasRepository } from 'src/areas/repository/area.repository';
import { AuthModule } from 'src/auth/auth.module';
import { UserRepository } from 'src/auth/repository/user.repository';
import { CategoriesModule } from 'src/categories/categories.module';
import { CategoriesService } from 'src/categories/categories.service';
import { CategoryRepository } from 'src/categories/repository/category.repository';
import { BoardPhotoRepository } from 'src/photo/repository/photo.repository';
import { ReviewRepository } from 'src/reviews/repository/review.repository';
import { ErrorConfirm } from 'src/common/utils/error';
import { BoardsController } from './boards.controller';
import { BoardsService } from './boards.service';
import { BoardRepository } from './repository/board.repository';
import { BasketsService } from 'src/baskets/baskets.service';
import { BasketRepository } from 'src/baskets/repository/baskets.repository';
import { AwsService } from 'src/aws/aws.service';
import { BoardLikeRepository } from 'src/like/repository/like.repository';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfig } from 'src/common/configs/jwt.config';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    JwtModule.registerAsync(jwtConfig),
    TypeOrmModule.forFeature([
      BoardRepository,
      ReviewRepository,
      CategoryRepository,
      AreasRepository,
      UserRepository,
      BoardPhotoRepository,
      BasketRepository,
      BoardLikeRepository,
    ]),
    CategoriesModule,
    AreasModule,
    AuthModule,
  ],
  controllers: [BoardsController],
  providers: [
    BoardsService,
    CategoriesService,
    BasketsService,
    AwsService,
    ErrorConfirm,
  ],
})
export class BoardsModule {}
