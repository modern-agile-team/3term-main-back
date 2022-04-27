import { Validate } from 'class-validator';
import { Major } from 'src/majors/entity/major.entity';
import {
  ReportContent,
  ReportedBoard,
  ReportedUser,
} from 'src/reports/entity/report.entity';
import { Review } from 'src/reviews/entity/review.entity';
import { School } from 'src/schools/entity/school.entity';
import { Category } from 'src/categories/entity/category.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Timestamp,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Letter } from 'src/letters/entity/letter.entity';
import { Mailbox, MailboxUser } from 'src/mailboxes/entity/mailbox.entity';
import { Spec } from 'src/specs/entity/spec.entity';
import { Faq } from 'src/faqs/entity/faq.entity';
import { Notice } from 'src/notices/entity/notice.entity';
import { Board } from 'src/boards/entity/board.entity';
import { userInfo } from 'os';
import { UserLike } from 'src/like/entity/user.like.entity';

@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  no: number;

  @Column({
    type: 'varchar',
    comment: '회원 이름',
  })
  name: string;

  @Column({
    type: 'varchar',
    comment: '회원 개인 프로필사진',
  })
  photo_url: string;

  @Column({
    unique: true,
    type: 'varchar',
    comment: '회원 이메일',
  })
  email: string;

  @Column({
    type: 'varchar',
    comment: '회원 전화번호',
  })
  phone: string;

  @Column({
    unique: true,
    type: 'varchar',
    comment: '회원 닉네임',
  })
  nickname: string;

  @Column({
    type: 'boolean',
    comment: '관리자 여부',
  })
  manager: boolean;

  @Column({
    type: 'varchar',
    comment: '암호화된 비밀번호',
  })
  salt: string;

  @Column({
    comment: '로그인 실패 횟수',
    default: 0,
  })
  loginFailCount: number;

  @Column({
    type: 'boolean',
    comment: '로그인 실패로 인한 계정 제한 여부',
    default: false,
  })
  isLock: boolean;

  @UpdateDateColumn({
    comment: '마지막으로 로그인을 시도한 시간',
  })
  latestLogin: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
    comment: '삭제일',
  })
  deletedAt: Date | null;

  @CreateDateColumn({
    name: 'created_at',
    comment: '회원가입 시간',
  })
  createdAt: Date;

  // 내가 좋아요 한 유저 목록
  @OneToMany((type) => UserLike, (userLike) => userLike.likedUser, {
    nullable: true,
  })
  likedUser: UserLike[];

  // 나를 좋아요한 유저 목록
  @OneToMany((type) => UserLike, (userLike) => userLike.likedMe, {
    nullable: true,
  })
  likedMe: UserLike[];

  @OneToMany((type) => Board, (board) => board.user, {
    onDelete: 'SET NULL',
  })
  boards: Board[];

  @OneToMany((type) => Letter, (letter) => letter.sender, {
    nullable: true,
  })
  sendLetters: Letter[];

  @OneToMany((type) => Letter, (letter) => letter.receiver, {
    nullable: true,
  })
  receivedLetters: Letter[];

  @OneToMany((type) => Faq, (faqs) => faqs.manager, {
    nullable: true,
  })
  faqs: Faq[];

  @OneToMany((type) => Faq, (faqs) => faqs.lastEditor, {
    nullable: true,
  })
  modifiedFaqs: Faq[];

  @OneToMany((type) => Notice, (notices) => notices.manager, {
    nullable: true,
  })
  notices: Notice[];

  @OneToMany((type) => Notice, (notices) => notices.lastEditor, {
    nullable: true,
  })
  modifiedNotices: Notice[];

  @OneToMany((type) => ReportedUser, (user) => user.reportedUser, {
    nullable: true,
    eager: true,
  })
  reports: ReportedUser[];

  @OneToMany((type) => ReportedUser, (user) => user.reportUser, {
    nullable: true,
    eager: true,
  })
  userReport: ReportedUser[];

  @OneToMany((type) => ReportedBoard, (board) => board.reportUser, {
    nullable: true,
    eager: true,
  })
  boardReport: ReportedBoard[];

  @OneToMany((type) => Review, (review) => review.reviewer)
  reviews: Review[];

  @OneToMany((type) => Spec, (spec) => spec.user)
  specs: Spec[];

  @ManyToOne((type) => School, (school) => school.no, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'school_no' })
  school: School;

  @ManyToOne((type) => Major, (major) => major.no, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'major_no' })
  major: Major;

  @ManyToMany((type) => Category, (category) => category.users)
  @JoinTable({ name: 'user_in_category' })
  categories: Category[];

  @OneToMany(() => MailboxUser, (mailboxUser) => mailboxUser.mailbox)
  mailboxUsers: MailboxUser;

  @ManyToMany((type) => Board, (board) => board.likedUser, {
    cascade: true,
  })
  likedBoard: Board[];
}
