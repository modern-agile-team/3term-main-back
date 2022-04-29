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

  @DeleteDateColumn()
  deleteAt: Date | null;

  @OneToMany((type) => Letter, (letters) => letters.mailbox)
  letters: Letter[];

  @OneToMany(() => MailboxUser, (mailboxUser) => mailboxUser.user)
  mailboxUsers: MailboxUser[];
}

@Entity('mailbox_user')
export class MailboxUser extends BaseEntity {
  @PrimaryGeneratedColumn()
  no: number;

  @ManyToOne(() => User, (user) => user.mailboxUsers, {
    nullable: true,
    onDelete: 'SET NULL',
    createForeignKeyConstraints: false,
  })
  user: User;

  @ManyToOne(() => Mailbox, (mailbox) => mailbox.mailboxUsers, {
    nullable: true,
    onDelete: 'SET NULL',
    createForeignKeyConstraints: false,
  })
  mailbox: Mailbox;
}
