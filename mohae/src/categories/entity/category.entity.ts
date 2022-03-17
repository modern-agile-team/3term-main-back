import { Board } from 'src/boards/entity/board.entity';
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('category')
export class Category extends BaseEntity {
  @PrimaryGeneratedColumn()
  no: number;

  @Column({
    type: 'varchar',
    length: 12,
  })
  name: string;

  @OneToMany((type) => Board, (board) => board.category, {
    nullable: true,
    eager: true,
  })
  boards: Board[];
}
