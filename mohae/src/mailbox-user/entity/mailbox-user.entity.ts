import { User } from 'src/auth/entity/user.entity';
import { Mailbox } from 'src/mailboxes/entity/mailbox.entity';
import { BaseEntity, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

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
