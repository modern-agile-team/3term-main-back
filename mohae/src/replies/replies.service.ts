import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WinstonLogger, WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { UserRepository } from 'src/auth/repository/user.repository';
import { Comment } from 'src/comments/entity/comment.entity';
import { CommentRepository } from 'src/comments/repository/comment.repository';
import { ErrorConfirm } from 'src/common/utils/error';
import { Connection, QueryRunner } from 'typeorm';
import { ReplyRepository } from './repository/reply.repository';

@Injectable()
export class RepliesService {
  constructor(
    @InjectRepository(ReplyRepository)
    private readonly replyRepository: ReplyRepository,

    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: WinstonLogger,

    private readonly commentRepository: CommentRepository,
    private readonly userRepository: UserRepository,

    private readonly connection: Connection,
    private readonly errorConfirm: ErrorConfirm,
  ) {}

  async createReply(
    commentNo: number,
    content: string,
    loginUserNo: number,
  ): Promise<void> {
    const queryRunner: QueryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const comment: Comment = await this.commentRepository.findOne(commentNo, {
        select: ['no'],
      });

      this.errorConfirm.notFoundError(
        comment,
        '대댓글을 작성할 댓글을 찾을 수 없습니다.',
      );

      const { affectedRows, insertId }: any = await queryRunner.manager
        .getCustomRepository(ReplyRepository)
        .createReply(comment, content);

      this.errorConfirm.badGatewayError(affectedRows, '대댓글 생성 실패');

      await queryRunner.manager
        .getCustomRepository(UserRepository)
        .userRelation(loginUserNo, insertId, 'replies');

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();

      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async updateReply(
    replyNo: number,
    content: string,
    loginUserNo: number,
  ): Promise<void> {
    try {
      const isWriter: boolean = await this.replyRepository.findOneReplyOfUser(
        replyNo,
        loginUserNo,
      );

      this.errorConfirm.unauthorizedError(
        isWriter,
        '대댓글을 작성한 유저가 아닙니다.',
      );

      const isUpdate: boolean = await this.replyRepository.updateReply(
        replyNo,
        content,
      );

      this.errorConfirm.badGatewayError(isUpdate, '대댓글 수정 실패');
    } catch (err) {
      throw err;
    }
  }

  async deleteReply(replyNo: number, loginUserNo: number): Promise<void> {
    try {
      const isWriter: boolean = await this.replyRepository.findOneReplyOfUser(
        replyNo,
        loginUserNo,
      );

      this.errorConfirm.unauthorizedError(
        isWriter,
        '대댓글을 작성한 유저가 아닙니다.',
      );

      const isDelete: boolean = await this.replyRepository.deleteReply(replyNo);

      this.errorConfirm.badGatewayError(isDelete, '대댓글 삭제 실패');
    } catch (err) {
      throw err;
    }
  }
}
