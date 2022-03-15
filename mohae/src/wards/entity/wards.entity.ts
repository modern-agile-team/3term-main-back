import { Area } from 'src/areas/entity/areas.entity';
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('wards')
export class Ward extends BaseEntity {
  @PrimaryGeneratedColumn({})
  @OneToMany((type) => Area, (area) => area.ward, { eager: false })
  no: number;

  @Column({
    type: 'varchar',
    length: 5,
  })
  name: string;
}
