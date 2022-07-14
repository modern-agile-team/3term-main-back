import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsNotEmpty, IsString, Length, MaxLength } from 'class-validator';
import { User } from 'src/auth/entity/user.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('faqs')
export class Faq extends BaseEntity {
  @PrimaryGeneratedColumn()
  no: number;

  @ApiProperty({
    example: 'test',
    description: 'FAQ 제목 입력',
    required: true,
  })
  @IsNotEmpty({
    message: '제목을 입력해 주세요.',
  })
  @IsString()
  @Length(3, 45, {
    message: '제목은 3자 ~ 45자 입력해 주세요.',
  })
  @Column({
    type: 'varchar',
    length: 45,
    comment: 'FAQ 제목',
  })
  title: string;

  @ApiProperty({
    example: 'FAQ 내용 입력',
    description: 'FAQ 내용 입력',
    required: true,
  })
  @IsNotEmpty({
    message: '내용을 입력해 주세요.',
  })
  @IsString()
  @MaxLength(1000, {
    message: '내용은 1000자 이내로 입력해 주세요.',
  })
  @Column({
    type: 'mediumtext',
    comment: 'FAQ 내용',
  })
  description: string;

  @CreateDateColumn({
    comment: 'FAQ 작성일',
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    comment: 'FAQ 수정일',
    name: 'updated_at',
  })
  updatedAt: Date;

  @Exclude()
  @DeleteDateColumn({
    comment: 'FAQ 삭제일',
    name: 'deleted_at',
  })
  deletedAt: Date | null;

  /* FAQ 외래키 */
  @ManyToOne(() => User, (user) => user.faqs, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({
    name: 'manager_no',
  })
  manager: User;

  @ManyToOne(() => User, (user) => user.modifiedFaqs, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({
    name: 'last_edit_manager_no',
  })
  lastEditor: User;
}
