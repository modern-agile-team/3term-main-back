import { Controller, Get } from '@nestjs/common';
import { Note } from './entity/note.entity';
import { NotesService } from './notes.service';

@Controller('notes')
export class NotesController {
  constructor(private noteService: NotesService) {}

  @Get()
  async getAllNote(): Promise<Note[]> {
    return await this.noteService.getAllNotes();
  }
}
