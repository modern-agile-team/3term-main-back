import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from 'src/auth/repository/user.repository';
import { Board } from 'src/boards/entity/board.entity';
import { BoardRepository } from 'src/boards/repository/board.repository';
import { ErrorConfirm } from 'src/common/utils/error';
import { Reply } from 'src/replies/entity/reply.entity';
import { ReplyRepository } from 'src/replies/repository/reply.repository';
import { Comment } from './entity/comment.entity';
import { CommentRepository } from './repository/comment.repository';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(CommentRepository)
    private readonly commentRepository: CommentRepository,

    private readonly boardRepository: BoardRepository,
    private readonly userRepository: UserRepository,
    private readonly replyRepository: ReplyRepository,

    private readonly errorConfirm: ErrorConfirm,
  ) {}

  async readAllComments(
    boardNo: number,
    loginUserNo: number,
  ): Promise<Comment[]> {
    try {
      const comments: Comment[] = await this.commentRepository.readAllComments(
        boardNo,
        loginUserNo,
      );

      if (comments.length) {
        for (const comment of comments) {
          const replies: Reply[] = await this.replyRepository.readAllReplies(
            comment['commentNo'],
          );

          comment['replies'] = replies;
        }

        return comments;
      }

      return comments;
    } catch (err) {
      throw err;
    }
  }

  async createComment(
    boardNo: number,
    content: string,
    loginUserNo: number,
  ): Promise<void> {
    try {
      const board: Board = await this.boardRepository.findOne(boardNo, {
        select: ['no'],
      });

      this.errorConfirm.notFoundError(
        board,
        '댓글을 작성하려는 게시글을 찾을 수 없습니다.',
      );

      const { affectedRows, insertId }: any =
        await this.commentRepository.createComment(board, content);

      this.errorConfirm.badGatewayError(affectedRows, '댓글 작성 실패');

      await this.userRepository.userRelation(loginUserNo, insertId, 'comments');
    } catch (err) {
      throw err;
    }
  }

  async updateComment(
    commentNo: number,
    content: string,
    loginUserNo: number,
  ): Promise<void> {
    try {
      const isCommenter: boolean =
        await this.commentRepository.findOneCommentOfUser(
          commentNo,
          loginUserNo,
        );

      this.errorConfirm.unauthorizedError(
        isCommenter,
        '댓글 작성자가 아닙니다.',
      );

      const isUpdate: boolean = await this.commentRepository.updateComment(
        commentNo,
        content,
      );

      this.errorConfirm.badGatewayError(isUpdate, '댓글 수정 실패');
    } catch (err) {
      throw err;
    }
  }

  async deleteComment(commentNo: number, loginUserNo: number): Promise<void> {
    try {
      const isCommenter: boolean =
        await this.commentRepository.findOneCommentOfUser(
          commentNo,
          loginUserNo,
        );

      this.errorConfirm.unauthorizedError(
        isCommenter,
        '댓글 작성자가 아닙니다.',
      );

      const isDelete: boolean = await this.commentRepository.deleteComment(
        commentNo,
      );

      this.errorConfirm.badGatewayError(isDelete, '댓글 삭제 실패');
    } catch (err) {
      throw err;
    }
  }
}
