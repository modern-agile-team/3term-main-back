import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MajorsController } from './majors.controller';
import { MajorsService } from './majors.service';
import { MajorRepository } from './repository/major.repository';

@Module({
  imports: [TypeOrmModule.forFeature([MajorRepository])],
  controllers: [MajorsController],
  providers: [MajorsService],
})
export class MajorsModule {}
