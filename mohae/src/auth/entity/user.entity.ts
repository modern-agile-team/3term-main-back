import { Major } from 'src/majors/entity/major.entity';
import { School } from 'src/schools/entity/school.entity';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Timestamp,
  Unique,
} from 'typeorm';

@Entity('users')
@Unique(['email', 'nickname'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  no: number;

  @Column({
    type: 'varchar',
    length: 12,
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  photo_url: string;

  @Column({
    type: 'timestamp',
  })
  in_date: Timestamp;

  // FK
  @ManyToOne((type) => School, (school) => school.no, {
    eager: true,
  })
  school_no: number;
  // FK
  @ManyToOne((type) => Major, (major) => major.no, {
    eager: true,
  })
  major_no: number;

  @Column({
    type: 'varchar',
    length: 255,
  })
  email: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  phone: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  nickname: string;

  @Column({
    type: 'boolean',
  })
  manager: boolean;

  @Column({
    type: 'varchar',
    length: 255,
  })
  salt: string;
}
