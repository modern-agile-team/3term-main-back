import { Letter } from 'src/letters/entity/letter.entity';
import {
  BaseEntity,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../auth/entity/user.entity';

@Entity('mailboxes')
export class Mailbox extends BaseEntity {
  @PrimaryGeneratedColumn()
  no: number;

  @CreateDateColumn()
  createAt: Date | null;

  @DeleteDateColumn()
  deleteAt: Date | null;

  @OneToMany((type) => Letter, (letters) => letters.mailbox)
  letters: Letter[];

  @ManyToMany((type) => User, (users) => users.mailboxes)
  @JoinTable({
    name: 'mailbox_of_user',
  })
  users: User[];
}
