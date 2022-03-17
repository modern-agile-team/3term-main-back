import { Board } from 'src/boards/entity/board.entity';
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('areas')
export class Area extends BaseEntity {
  @PrimaryGeneratedColumn()
  @OneToMany((type) => Board, (board) => board.no, {
    nullable: true,
    eager: true,
  })
  no: number;

  @Column({
    type: 'varchar',
    length: 10,
  })
  name: string;
}
