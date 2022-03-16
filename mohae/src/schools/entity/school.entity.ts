import { User } from 'src/auth/entity/user.entity';
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('schools')
export class School extends BaseEntity {
  @PrimaryGeneratedColumn()
  no: number;

  @Column({
    type: 'varchar',
    length: 15,
  })
  name: string;

<<<<<<< HEAD
  // @OneToMany((type) => User, (user) => user.no, { eager: true })
=======
  @OneToMany((type) => User, (user) => user.school)
>>>>>>> e0bba48d0ff09a441f52b1098e08d1fa9a4e6507
  users: User[];
}
