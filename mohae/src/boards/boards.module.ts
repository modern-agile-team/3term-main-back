import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AreasModule } from 'src/areas/areas.module';
import { AreasRepository } from 'src/areas/repository/area.repository';
import { AuthModule } from 'src/auth/auth.module';
import { UserRepository } from 'src/auth/repository/user.repository';
import { CategoriesModule } from 'src/categories/categories.module';
import { CategoriesService } from 'src/categories/categories.service';
import { CategoryRepository } from 'src/categories/repository/category.repository';
import { ReviewRepository } from 'src/reviews/repository/review.repository';
import { ErrorConfirm } from 'src/utils/error';
import { BoardsController } from './boards.controller';
import { BoardsService } from './boards.service';
import { BoardRepository } from './repository/board.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BoardRepository,
      ReviewRepository,
      CategoryRepository,
      AreasRepository,
      UserRepository,
    ]),
    CategoriesModule,
    AreasModule,
    AuthModule,
  ],
  controllers: [BoardsController],
  providers: [BoardsService, CategoriesService, ErrorConfirm],
})
export class BoardsModule {}
