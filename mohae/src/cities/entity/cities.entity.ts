import { Areas } from 'src/areas/entity/areas.entity';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('cities')
export class Cities extends BaseEntity {
  @PrimaryGeneratedColumn({
  })
  @OneToMany((type) => Areas, (area) => area.city, { eager: false })
  no: number;

  @Column({
    type: 'varchar',
    length: 10,
  })
  name: string;
}
