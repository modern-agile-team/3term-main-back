import { User } from 'src/auth/entity/user.entity';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('majors')
export class Major extends BaseEntity {
  @PrimaryGeneratedColumn()
  no: number;

  @OneToMany((type) => User, (user) => user.no, {
    eager: true,
    onUpdate: 'CASCADE',
  })
  users: User[];

  @Column({
    type: 'varchar',
    length: 15,
  })
  name: string;
}
