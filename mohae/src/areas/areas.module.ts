import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardRepository } from 'src/boards/repository/board.repository';
import { AreasController } from './areas.controller';
import { AreasService } from './areas.service';
import { AreasRepository } from './repository/area.repository';

@Module({
  imports: [TypeOrmModule.forFeature([AreasRepository, BoardRepository])],
  controllers: [AreasController],
  providers: [AreasService],
})
export class AreasModule {}
