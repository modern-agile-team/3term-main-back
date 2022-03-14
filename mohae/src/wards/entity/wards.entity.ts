import { Areas } from 'src/areas/entity/areas.entity';
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('wards')
export class Wards extends BaseEntity {
  @PrimaryGeneratedColumn({
  })
  @OneToMany((type) => Areas, (area) => area.ward, { eager: false })
  no: number;

  @Column({
    type: 'varchar',
    length: 5,
  })
  name: string;
}
