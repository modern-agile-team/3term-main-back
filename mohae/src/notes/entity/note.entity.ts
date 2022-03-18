import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('notes')
export class Note extends BaseEntity {
    @PrimaryGeneratedColumn()
    no: number;

     @Column({
        type: "mediumtext"
     })
    note1: string;

    @Column({
        type: "mediumtext"
    })
    note2: string;
    
    @Column({
        type: "mediumtext"
    })
    note3: string;
}