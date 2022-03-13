import { Module } from '@nestjs/common';
import { CitiesService } from './cities.service';
import { CitiesController } from './cities.controller';
import { CitiesRepository } from './repository/citie.repository';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([CitiesRepository])],
  providers: [CitiesService],
  controllers: [CitiesController],
})
export class CitiesModule {}
