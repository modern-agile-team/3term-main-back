import { Board } from 'src/boards/entity/board.entity';
import { Cities } from 'src/cities/entity/cities.entity';
import { Wards } from 'src/wards/entity/wards.entity';
import {
  BaseEntity,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('areas')
export class Areas extends BaseEntity {
  @PrimaryGeneratedColumn()
  @OneToMany((type) => Board, (board) => board.area, { eager: false })
  no: number;

  @ManyToOne((type) => Cities, (cities) => cities.no, { eager: true })
  city: number;

  @ManyToOne((type) => Wards, (ward) => ward.no, { eager: true })
  ward: number;
}
