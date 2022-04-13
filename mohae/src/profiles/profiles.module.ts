import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { UserRepository } from 'src/auth/repository/user.repository';
import { CategoriesModule } from 'src/categories/categories.module';
import { CategoryRepository } from 'src/categories/repository/category.repository';
import { MajorsModule } from 'src/majors/majors.module';
import { MajorRepository } from 'src/majors/repository/major.repository';
import { SchoolRepository } from 'src/schools/repository/school.repository';
import { SchoolsModule } from 'src/schools/schools.module';
import { ProfilesController } from './profiles.controller';
import { ProfilesService } from './profiles.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserRepository,
      SchoolRepository,
      MajorRepository,
      CategoryRepository,
    ]),
    AuthModule,
    SchoolsModule,
    MajorsModule,
    CategoriesModule,
  ],
  controllers: [ProfilesController],
  providers: [ProfilesService],
})
export class ProfilesModule {}
