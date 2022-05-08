import { User } from 'src/auth/entity/user.entity';
import { Mailbox } from 'src/mailboxes/entity/mailbox.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('letters')
export class Letter extends BaseEntity {
  @PrimaryGeneratedColumn()
  no: number;

  @Column({
    type: 'varchar',
    length: 100,
    comment: '쪽지 내용',
  })
  description: string;

  @Column({
    type: 'boolean',
    comment: '읽었는지 안읽었는지 유무 판단',
    default: false,
  })
  reading_flag: boolean;

  @CreateDateColumn({
    name: 'create_at',
    comment: '쪽지 전송 시간',
  })
  createdAt: Date | null;

  @DeleteDateColumn({
    name: 'delete_at',
    comment: '쪽지 삭제 시간',
  })
  deleteDate: Date | null;

  @ManyToOne((type) => Mailbox, (mailbox) => mailbox.no, {
    onDelete: 'SET NULL',
  })
  mailbox: Mailbox;

  @ManyToOne((type) => User, (user) => user.no, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({
    name: 'sender_no',
  })
  sender: User;

  @ManyToOne((type) => User, (user) => user.no, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({
    name: 'receiver_no',
  })
  receiver: User;
}
