import { Board } from 'src/boards/entity/board.entity';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('areas')
export class Area extends BaseEntity {
  @PrimaryGeneratedColumn()
  no: number;

  @Column({
    type: 'varchar',
    length: 10,
  })
  name: string;

  @ManyToOne((type) => Board, (board) => board.no, {
    nullable: true,
    eager: true,
  })
  board: Board[];
}
