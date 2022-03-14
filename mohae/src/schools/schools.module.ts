import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SchoolRepository } from './repository/school.repository';
import { SchoolsController } from './schools.controller';
import { SchoolsService } from './schools.service';

@Module({
  imports: [TypeOrmModule.forFeature([SchoolRepository])],
  controllers: [SchoolsController],
  providers: [SchoolsService],
})
export class SchoolsModule {}
