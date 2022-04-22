import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';
import { NoteRepository } from './repository/note.repository';

@Module({
  imports: [TypeOrmModule.forFeature([NoteRepository])],
  controllers: [NotesController],
  providers: [NotesService]
})
export class NotesModule {}
