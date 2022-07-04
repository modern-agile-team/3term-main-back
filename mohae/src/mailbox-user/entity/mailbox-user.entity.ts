import { Exclude } from 'class-transformer';
import { User } from 'src/auth/entity/user.entity';
import { Mailbox } from 'src/mailboxes/entity/mailbox.entity';
import {
  BaseEntity,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('mailbox_user')
export class MailboxUser extends BaseEntity {
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
