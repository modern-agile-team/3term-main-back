import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Note } from './entity/note.entity';
import { NoteRepository } from './repository/note.repository';

@Injectable()
export class NotesService {
    constructor(
        @InjectRepository(NoteRepository)
        private noteRepository: NoteRepository
    ){}

    async getAllNotes(): Promise<Note[]> {
        return this.noteRepository.find()
    }
}
