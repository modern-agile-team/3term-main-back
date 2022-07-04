import { EntityRepository, Repository } from "typeorm";
import { Note } from "../entity/note.entity";

@EntityRepository(Note)
export class NoteRepository extends Repository<Note> {}