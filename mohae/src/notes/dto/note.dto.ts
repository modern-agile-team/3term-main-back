import { IsString } from "class-validator";

export abstract class CreateNoteDto {
    @IsString()
    note1: string;

    @IsString()
    note2: string;

    @IsString()
    note3: string;
}