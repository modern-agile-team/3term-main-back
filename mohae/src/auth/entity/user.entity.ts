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
    comment: '회원 이름',
  })
  name: string;

  @Column({
    type: 'varchar',
    comment: '회원 개인 프로필사진',
  })
  photo_url: string;

  @Column({
    type: 'timestamp',
    comment: '회원가입시간',
  })
  in_date: Timestamp;

  @ManyToOne((type) => School, (school) => school.no, { eager: true })
  @JoinColumn({ name: 'school_no' })
  school: School;

  @ManyToOne((type) => Major, (major) => major.no, { eager: true })
  @JoinColumn({ name: 'major_no' })
  major: Major;

  @Column({
    unique: true,
    type: 'varchar',
    comment: '회원 이메일',
  })
  email: string;

  @Column({
    type: 'varchar',
    comment: '회원 전화번호',
  })
  phone: string;

  @Column({
    unique: true,
    type: 'varchar',
    comment: '회원 닉네임',
  })
  nickname: string;

  @Column({
    type: 'boolean',
    comment: '관리자 여부',
  })
  manager: boolean;

  @Column({
    type: 'varchar',
    comment: '암호화된 비밀번호',
  })
  salt: string;
}
