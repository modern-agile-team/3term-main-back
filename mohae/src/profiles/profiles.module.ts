import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { UserRepository } from 'src/auth/repository/user.repository';
import { CategoriesModule } from 'src/categories/categories.module';
import { CategoryRepository } from 'src/categories/repository/category.repository';
import { LikeModule } from 'src/like/like.module';
import { LikeRepository } from 'src/like/repository/like.repository';
import { MajorsModule } from 'src/majors/majors.module';
import { MajorRepository } from 'src/majors/repository/major.repository';
import { SchoolRepository } from 'src/schools/repository/school.repository';
import { SchoolsModule } from 'src/schools/schools.module';
import { ErrorConfirm } from 'src/common/utils/error';
import { ProfilesController } from './profiles.controller';
import { ProfilesService } from './profiles.service';
import { SpecRepository } from 'src/specs/repository/spec.repository';
import { SpecsModule } from 'src/specs/specs.module';
import { BoardRepository } from 'src/boards/repository/board.repository';
import { BoardsModule } from 'src/boards/boards.module';
import { ReviewRepository } from 'src/reviews/repository/review.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserRepository,
      SchoolRepository,
      MajorRepository,
      CategoryRepository,
      LikeRepository,
      SpecRepository,
      BoardRepository,
      ReviewRepository,
    ]),
    AuthModule,
    SchoolsModule,
    MajorsModule,
    CategoriesModule,
    SpecsModule,
    LikeModule,
    BoardsModule,
    ReviewRepository,
  ],
  controllers: [ProfilesController],
  providers: [ProfilesService, ErrorConfirm],
})
export class ProfilesModule {}
