import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';
import { UserRepository } from 'src/auth/repository/user.repository';
import { SchoolRepository } from './repository/school.repository';
import { SchoolsController } from './schools.controller';
import { SchoolsService } from './schools.service';

@Module({
  imports: [TypeOrmModule.forFeature([SchoolRepository])],
  controllers: [SchoolsController],
  providers: [SchoolsService],
})
export class SchoolsModule {}
