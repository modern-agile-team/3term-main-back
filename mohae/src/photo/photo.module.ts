import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardRepository } from 'src/boards/repository/board.repository';
import { SpecRepository } from 'src/specs/repository/spec.repository';
import { PhotoController } from './photo.controller';
import { PhotoService } from './photo.service';

@Module({
  imports: [TypeOrmModule.forFeature([SpecRepository]), SpecRepository],
  controllers: [PhotoController],
  providers: [PhotoService],
})
export class PhotoModule {}
