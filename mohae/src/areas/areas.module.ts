import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AreasController } from './areas.controller';
import { AreasService } from './areas.service';
import { AreasRepository } from './repository/area.repository';

@Module({
  imports: [TypeOrmModule.forFeature([AreasRepository])],
  controllers: [AreasController],
  providers: [AreasService],
})
export class AreasModule {}
