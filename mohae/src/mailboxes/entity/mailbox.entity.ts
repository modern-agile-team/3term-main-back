import { Letter } from 'src/letters/entity/letter.entity';
import {
  BaseEntity,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
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

  @DeleteDateColumn({
    select: false,
  })
  deleteAt: Date | null;

  @OneToMany((type) => Letter, (letters) => letters.mailbox)
  letters: Letter[];

  @OneToMany(() => MailboxUser, (mailboxUser) => mailboxUser.mailbox)
  mailboxUsers: MailboxUser[];
}

@Entity('mailbox_user')
export class MailboxUser extends BaseEntity {
  @PrimaryGeneratedColumn()
  no: number;

  @ManyToOne(() => Mailbox, (mailbox) => mailbox.mailboxUsers, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  mailbox: Mailbox;

  @ManyToOne(() => User, (user) => user.mailboxUsers, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  user: User;
}
