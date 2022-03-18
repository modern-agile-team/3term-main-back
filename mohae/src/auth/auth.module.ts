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
<<<<<<< HEAD
import { MajorRepository } from 'src/majors/repository/major.repository';
import { MajorsModule } from 'src/majors/majors.module';
=======
import { JwtStrategy } from './jwt/jwt.strategy';
>>>>>>> 99fc3c21b9abe4a40dee0dceb36dbbb178bc5231

const jwtConfig = config.get('jwt');
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
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
    ]),
    SchoolsModule,
    MajorsModule,
  ],
  controllers: [AuthController],
<<<<<<< HEAD
  providers: [AuthService],
=======
  providers: [AuthService, JwtStrategy],
  exports: [JwtStrategy, PassportModule],
>>>>>>> 99fc3c21b9abe4a40dee0dceb36dbbb178bc5231
})
export class AuthModule {}
