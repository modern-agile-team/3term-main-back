import { User } from 'src/auth/entity/user.entity';
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('majors')
export class Major extends BaseEntity {
  @PrimaryGeneratedColumn()
  no: number;

  @Column({
    type: 'varchar',
    length: 15,
    comment: '전공 이름',
  })
  name: string;

  @OneToMany((type) => User, (user) => user.major)
  users: User[];
}
