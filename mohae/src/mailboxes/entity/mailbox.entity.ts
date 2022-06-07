import { Exclude } from 'class-transformer';
import { Letter } from 'src/letters/entity/letter.entity';
import { MailboxUser } from 'src/mailbox-user/entity/mailbox-user.entity';
import {
  BaseEntity,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('mailboxes')
export class Mailbox extends BaseEntity {
  @PrimaryGeneratedColumn()
  no: number;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: Date;

  @Exclude()
  @DeleteDateColumn({
    name: 'deleted_at',
  })
  deletedAt: Date | null;

  @OneToMany(() => Letter, (letters) => letters.mailbox, {
    nullable: true,
  })
  letters: Letter[];

  @OneToMany(() => MailboxUser, (mailboxUser) => mailboxUser.mailbox, {
    nullable: true,
  })
  mailboxUsers: MailboxUser[];
}
