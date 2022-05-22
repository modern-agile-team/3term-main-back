import { Letter } from 'src/letters/entity/letter.entity';
import { MailboxUser } from 'src/mailbox-user/entity/mailbox-user.entity';
import {
  BaseEntity,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

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
