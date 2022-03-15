import { Area } from 'src/areas/entity/areas.entity';
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('cities')
export class City extends BaseEntity {
  @PrimaryGeneratedColumn({})
  @OneToMany((type) => Area, (area) => area.city, { eager: false })
  no: number;

  @Column({
    type: 'varchar',
    length: 10,
  })
  name: string;
}
