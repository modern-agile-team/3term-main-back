import { Exclude } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
} from 'class-validator';
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

  @IsNotEmpty({ message: '쪽지 내용을 입력해 주세요.' })
  @IsString()
  @MaxLength(500, { message: '500자 이내로 작성해 주세요.' })
  @Column({
    type: 'mediumtext',
    comment: '쪽지 내용',
  })
  description: string;

  @IsBoolean()
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

  @Exclude()
  @DeleteDateColumn({
    name: 'delete_at',
    comment: '쪽지 삭제 시간',
  })
  deleteDate: Date | null;

  @ManyToOne((type) => Mailbox, (mailbox) => mailbox.no, {
    onDelete: 'SET NULL',
  })
  mailbox: Mailbox;

  @IsNotEmpty()
  @IsNumber()
  @ManyToOne((type) => User, (user) => user.no, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({
    name: 'sender_no',
  })
  sender: User;

  @IsNotEmpty()
  @IsNumber()
  @ManyToOne((type) => User, (user) => user.no, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({
    name: 'receiver_no',
  })
  receiver: User;
}
