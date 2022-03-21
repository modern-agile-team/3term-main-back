import { Board } from 'src/boards/entity/board.entity';
import {
  BaseEntity,
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('notes')
export class Note extends BaseEntity {
  @PrimaryGeneratedColumn()
  no: number;

  @Column({
    type: 'mediumtext',
  })
  note1: string;

  @Column({
    type: 'mediumtext',
  })
  note2: string;

  @Column({
    type: 'mediumtext',
  })
  note3: string;

  @OneToOne((type) => Board, (board) => board.no)
  board: Board;
}
