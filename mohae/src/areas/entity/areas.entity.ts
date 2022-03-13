import { Board } from 'src/boards/entity/board.entity';
import { Cities } from 'src/cities/entity/cities.entity';
import { Wards } from 'src/wards/entity/wards.entity';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('areas')
export class Areas extends BaseEntity {
  @PrimaryGeneratedColumn({
    type: 'int',
  })
  @OneToMany((type) => Board, (board) => board.area_no, { eager: false })
  no: number;

  @ManyToOne((type) => Cities, (cities) => cities.no, { eager: true })
  city: number;

  @ManyToOne((type) => Wards, (ward) => ward.no, { eager: true })
  ward: number;
}
