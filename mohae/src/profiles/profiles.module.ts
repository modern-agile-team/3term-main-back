import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { CategoriesModule } from 'src/categories/categories.module';
import { LikeModule } from 'src/like/like.module';
import { MajorsModule } from 'src/majors/majors.module';
import { SchoolsModule } from 'src/schools/schools.module';
import { SpecsModule } from 'src/specs/specs.module';
import { BoardsModule } from 'src/boards/boards.module';
import { PhotoModule } from 'src/photo/photo.module';
import { ProfilesController } from './profiles.controller';
import { ProfilesService } from './profiles.service';
import { AwsService } from 'src/aws/aws.service';
import { UserRepository } from 'src/auth/repository/user.repository';
import { CategoryRepository } from 'src/categories/repository/category.repository';
import { LikeRepository } from 'src/like/repository/like.repository';
import { MajorRepository } from 'src/majors/repository/major.repository';
import { SchoolRepository } from 'src/schools/repository/school.repository';
import { SpecRepository } from 'src/specs/repository/spec.repository';
import { BoardRepository } from 'src/boards/repository/board.repository';
import { ProfilePhotoRepository } from 'src/photo/repository/photo.repository';
import { ReviewRepository } from 'src/reviews/repository/review.repository';
import { ErrorConfirm } from 'src/common/utils/error';

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
      ProfilePhotoRepository,
    ]),
    AuthModule,
    SchoolsModule,
    MajorsModule,
    CategoriesModule,
    SpecsModule,
    LikeModule,
    BoardsModule,
    ReviewRepository,
    PhotoModule,
  ],
  controllers: [ProfilesController],
  providers: [ProfilesService, AwsService, ErrorConfirm],
})
export class ProfilesModule {}
