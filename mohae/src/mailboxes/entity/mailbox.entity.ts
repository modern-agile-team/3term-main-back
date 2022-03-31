import {
  BaseEntity,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../auth/entity/user.entity';

@Entity('mailboxes')
export class MailBox extends BaseEntity {
  @PrimaryGeneratedColumn()
  no: number;

  @ManyToMany((type) => User, (users) => users.no)
  @JoinTable({
    name: 'mailbox_of_user',
  })
  users: User;

  @CreateDateColumn()
  createAt: Date | null;

  @DeleteDateColumn()
  deleteAt: Date | null;
}
