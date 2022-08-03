import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserRepository } from './repository/user.repository';
import { SchoolRepository } from 'src/schools/repository/school.repository';
import { SchoolsModule } from 'src/schools/schools.module';
import { MajorRepository } from 'src/majors/repository/major.repository';
import { MajorsModule } from 'src/majors/majors.module';
import { JwtStrategy } from './jwt/jwt.strategy';
import { CategoryRepository } from 'src/categories/repository/category.repository';
import { CategoriesModule } from 'src/categories/categories.module';
import { ErrorConfirm } from 'src/common/utils/error';
import { LoginProcess } from 'src/common/utils/login';
import { SpecRepository } from 'src/specs/repository/spec.repository';
import { LikeRepository } from 'src/like/repository/like.repository';
import { ScheduleModule } from '@nestjs/schedule';
import { TermsModule } from 'src/terms/terms.module';
import {
  TermsReporitory,
  TermsUserReporitory,
} from 'src/terms/repository/terms.repository';
import { jwtConfig } from 'src/common/configs/jwt.config';
import { cacheModule } from 'src/common/configs/redis.config';
import { JwtRefreshStrategy } from './jwt/jwt-refresh.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    //1
    ScheduleModule.forRoot(),
    JwtModule.registerAsync(jwtConfig),
    TypeOrmModule.forFeature([
      TermsReporitory,
      TermsUserReporitory,
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
    TermsModule,
    cacheModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    JwtRefreshStrategy,
    ErrorConfirm,
    LoginProcess,
  ],
  exports: [JwtRefreshStrategy, JwtStrategy, PassportModule],
})
export class AuthModule {}
