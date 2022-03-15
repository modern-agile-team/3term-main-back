import { Board } from 'src/boards/entity/board.entity';
import { City } from 'src/cities/entity/cities.entity';
import { Ward } from 'src/wards/entity/wards.entity';
import {
  BaseEntity,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('areas')
export class Area extends BaseEntity {
  @PrimaryGeneratedColumn()
  @OneToMany((type) => Board, (board) => board.area, { eager: false })
  no: number;

  @ManyToOne((type) => City, (citie) => citie.no, { eager: true })
  city: number;

  @ManyToOne((type) => Ward, (ward) => ward.no, { eager: true })
  ward: number;
}
