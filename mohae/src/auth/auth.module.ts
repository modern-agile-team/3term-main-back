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
    TypeOrmModule.forFeature([UserRepository, SchoolRepository]),
    SchoolsModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, SchoolsService],
})
export class AuthModule {}
