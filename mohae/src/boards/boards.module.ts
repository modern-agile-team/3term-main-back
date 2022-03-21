import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AreasRepository } from 'src/areas/repository/area.repository';
import { AuthModule } from 'src/auth/auth.module';
import { CategoriesModule } from 'src/categories/categories.module';
import { CategoriesService } from 'src/categories/categories.service';
import { CategoryRepository } from 'src/categories/repository/category.repository';
import { ReviewRepository } from 'src/reviews/repository/review.repository';
import { BoardsController } from './boards.controller';
import { BoardsService } from './boards.service';
import { BoardRepository } from './repository/board.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([BoardRepository, ReviewRepository]),
    TypeOrmModule.forFeature([CategoryRepository]),
    TypeOrmModule.forFeature([AreasRepository]),
    CategoriesModule,
    AuthModule,
  ],
  controllers: [BoardsController],
  providers: [BoardsService, CategoriesService],
})
export class BoardsModule {}
