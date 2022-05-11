import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserRepository } from './repository/user.repository';
import * as config from 'config';
import { SchoolRepository } from 'src/schools/repository/school.repository';
import { SchoolsModule } from 'src/schools/schools.module';
import { SchoolsService } from 'src/schools/schools.service';
import { MajorRepository } from 'src/majors/repository/major.repository';
import { MajorsModule } from 'src/majors/majors.module';
import { JwtStrategy } from './jwt/jwt.strategy';
import { CategoryRepository } from 'src/categories/repository/category.repository';
import { CategoriesModule } from 'src/categories/categories.module';
import { ErrorConfirm } from 'src/utils/error';
import { LoginProcess } from 'src/utils/login';
import { User } from './entity/user.entity';
import { SpecRepository } from 'src/specs/repository/spec.repository';
import { LikeRepository } from 'src/like/repository/like.repository';
import { ScheduleModule } from '@nestjs/schedule';

const jwtConfig = config.get('jwt');

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    //1
    ScheduleModule.forRoot(),
    JwtModule.register({
      secret: process.env.JWT_SECRET || jwtConfig.secret,
      signOptions: {
        expiresIn: jwtConfig.expiresIn,
      },
    }),
    TypeOrmModule.forFeature([
      UserRepository,
      SchoolRepository,
      MajorRepository,
      CategoryRepository,
      SpecRepository,
      LikeRepository,
    ]),
    SchoolsModule,
    MajorsModule,
    CategoriesModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, ErrorConfirm, LoginProcess],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
