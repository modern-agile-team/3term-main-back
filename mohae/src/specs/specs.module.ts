import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpecsController } from './specs.controller';
import { SpecsService } from './specs.service';

@Module({
  //   imports:[TypeOrmModule.forFeature([SpecsRepository])],
  controllers: [SpecsController],
  providers: [SpecsService],
})
export class SpecsModule {}
