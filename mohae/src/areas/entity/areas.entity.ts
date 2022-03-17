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

  @OneToMany((type) => Board, (board) => board.area, {
    nullable: true,
    eager: true,
  })
  board: Board;
}
