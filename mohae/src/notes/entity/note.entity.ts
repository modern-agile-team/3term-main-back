import { Board } from "src/boards/entity/board.entity";
import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('notes')
export class Note extends BaseEntity {
    @PrimaryGeneratedColumn()
    no: number;

    @Column({
        type: 'int'
    })
    boardNo: number

    @OneToMany((type) => Board, (board) => board.note, {
        eager: true,
      })
    board: number;

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