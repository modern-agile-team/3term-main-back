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
import { ErrorConfirm } from 'src/utils/error';
import { ProfilesController } from './profiles.controller';
import { ProfilesService } from './profiles.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserRepository,
      SchoolRepository,
      MajorRepository,
      CategoryRepository,
      LikeRepository,
    ]),
    AuthModule,
    SchoolsModule,
    MajorsModule,
    CategoriesModule,
    LikeModule,
  ],
  controllers: [ProfilesController],
  providers: [ProfilesService, ErrorConfirm],
})
export class ProfilesModule {}
