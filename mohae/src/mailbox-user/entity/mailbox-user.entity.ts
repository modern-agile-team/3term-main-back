import { User } from 'src/auth/entity/user.entity';
import { Mailbox } from 'src/mailboxes/entity/mailbox.entity';
import {
  BaseEntity,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('mailbox_user')
export class MailboxUser extends BaseEntity {
  @PrimaryGeneratedColumn()
  no: number;

  @ManyToOne(() => Mailbox, (mailbox) => mailbox.mailboxUsers, {
    onUpdate: 'CASCADE',
    onDelete: 'NO ACTION',
    nullable: false,
  })
  @JoinColumn({
    name: 'mailbox_no',
  })
  mailbox: Mailbox;

  @ManyToOne(() => User, (user) => user.mailboxUsers, {
    onUpdate: 'CASCADE',
    onDelete: 'NO ACTION',
    nullable: false,
  })
  @JoinColumn({
    name: 'user_no',
  })
  user: User;
}
