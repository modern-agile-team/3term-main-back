import { Validate } from 'class-validator';
import { Major } from 'src/majors/entity/major.entity';
import { ReportedUser } from 'src/reports/entity/report.entity';
import { Review } from 'src/reviews/entity/review.entity';
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
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  no: number;

  @Column({
    type: 'varchar',
    // length: 12 ,
  })
  name: string;

  @Column({
    type: 'varchar',
    // length: 255,
  })
  photo_url: string;

  @Column({
    type: 'timestamp',
  })
  in_date: Timestamp;

  @ManyToOne((type) => School, (school) => school.users, { eager: true })
  school: number;

  @ManyToOne((type) => Major, (major) => major, { eager: true })
  major: number;

  @Column({
    unique: true,
    type: 'varchar',
    // length: 30,
  })
  email: string;

  @Column({
    type: 'varchar',
    // length: 13,,
  })
  phone: string;

  @Column({
    unique: true,
    type: 'varchar',
    // length: 8,
  })
  nickname: string;

  @Column({
    type: 'boolean',
  })
  manager: boolean;

  @Column({
    type: 'varchar',
    // length: 255,
  })
  salt: string;
}
