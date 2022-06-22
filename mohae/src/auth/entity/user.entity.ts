import { Validate } from 'class-validator';
import { Major } from 'src/majors/entity/major.entity';
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
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Letter } from 'src/letters/entity/letter.entity';
import { Spec } from 'src/specs/entity/spec.entity';
import { Faq } from 'src/faqs/entity/faq.entity';
import { Notice } from 'src/notices/entity/notice.entity';
import { Board } from 'src/boards/entity/board.entity';
import { UserLike } from 'src/like/entity/user.like.entity';
import { BoardLike } from 'src/like/entity/board.like.entity';
import { MailboxUser } from 'src/mailbox-user/entity/mailbox-user.entity';
import { TermsUser } from 'src/terms/entity/terms.entity';
import { Terms } from 'src/terms/entity/terms.entity';
import { Basket } from 'src/baskets/entity/baskets.entity';
import { ReportedUser } from 'src/reports/entity/reported-user.entity';
import { ReportedBoard } from 'src/reports/entity/reported-board.entity';
import { ProfilePhoto } from 'src/photo/entity/profile.photo.entity';
import { Comment } from 'src/comments/entity/comment.entity';
import { Reply } from 'src/replies/entity/reply.entity';

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
    select: false,
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

  @OneToOne(() => ProfilePhoto, (profilePhoto) => profilePhoto.user)
  profilePhoto: ProfilePhoto;

  @OneToMany((type) => TermsUser, (termsUser) => termsUser.user, {
    nullable: true,
  })
  userTerms: TermsUser[];

  // 나를 좋아요 한 유저 목록
  @OneToMany((type) => UserLike, (userLike) => userLike.likedUser, {
    nullable: true,
  })
  likedUser: UserLike[];

  // 내가 좋아요한 유저 목록
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
    onDelete: 'SET NULL',
  })
  sendLetters: Letter[];

  @OneToMany((type) => Letter, (letter) => letter.receiver, {
    nullable: true,
    onDelete: 'SET NULL',
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
  })
  reports: ReportedUser[];

  @OneToMany((type) => ReportedUser, (user) => user.reportUser, {
    nullable: true,
  })
  userReport: ReportedUser[];

  @OneToMany((type) => ReportedBoard, (board) => board.reportUser, {
    nullable: true,
  })
  boardReport: ReportedBoard[];

  @OneToMany((type) => Review, (review) => review.reviewer)
  reviews: Review[];

  @OneToMany((type) => Spec, (spec) => spec.user)
  specs: Spec[];

  @ManyToOne((type) => School, (school) => school.users, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'school_no' })
  school: School;

  @ManyToOne((type) => Major, (major) => major.users, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'major_no' })
  major: Major;

  @ManyToMany((type) => Category, (category) => category.users)
  @JoinTable({ name: 'user_in_category' })
  categories: Category[];

  @OneToMany(() => MailboxUser, (mailboxUser) => mailboxUser.user, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  mailboxUsers: MailboxUser[];

  @OneToMany((type) => BoardLike, (boardLike) => boardLike.likedUser, {
    nullable: true,
  })
  likedBoard: BoardLike[];

  @OneToMany((type) => Review, (review) => review.targetUser)
  reviewBasket: Review[];

  @OneToMany((type) => Basket, (basket) => basket.boardNo)
  baskets: Basket[];

  @OneToMany(() => Comment, (comment) => comment.commenter, {
    nullable: true,
  })
  comments: Comment[];

  @OneToMany(() => Reply, (reply) => reply.writer)
  replies: Reply[];
}
