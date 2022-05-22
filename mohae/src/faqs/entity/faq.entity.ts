import { Exclude } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';
import { User } from 'src/auth/entity/user.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from 'typeorm';

@Entity('faqs')
export class Faq extends BaseEntity {
  @PrimaryGeneratedColumn()
  no: number;

  @IsNotEmpty({ message: '제목을 입력해 주세요.' })
  @IsString()
  @Length(3, 45, { message: '제목은 3자 ~ 45자 입력해 주세요.' })
  @Column({
    type: 'varchar',
    length: 30,
    comment: 'FAQ 제목',
  })
  title: string;

  @IsNotEmpty({ message: '내용을 입력해 주세요.' })
  @IsString()
  @MaxLength(1000, { message: '내용은 1000자 이내로 입력해 주세요.' })
  @Column({
    type: 'mediumtext',
    comment: 'FAQ 내용',
  })
  description: string;

  @CreateDateColumn({
    comment: 'FAQ 작성일',
  })
  createdAt: Date | null;

  @UpdateDateColumn({
    comment: 'FAQ 수정일',
  })
  updatedAt: Date | null;

  @Exclude()
  @DeleteDateColumn({
    comment: 'FAQ 삭제일',
  })
  deletedAt: Date | null;

  /* 관리자 번호 */
  @IsNotEmpty()
  @IsNumber()
  @RelationId((faq: Faq) => faq.manager)
  managerNo: number;

  @IsNotEmpty()
  @IsNumber()
  @RelationId((faq: Faq) => faq.lastEditor)
  lastEditorNo: number;

  /* FAQ 외래키 */
  @ManyToOne((type) => User, (user) => user.faqs, { onDelete: 'SET NULL' })
  manager: User;

  @ManyToOne((type) => User, (user) => user.modifiedFaqs, {
    onDelete: 'SET NULL',
  })
  lastEditor: User;
}
