import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BoardRepository } from 'src/boards/repository/board.repository';
import { ErrorConfirm } from 'src/common/utils/error';
import { InsertResult } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { ParamCommentDto } from './dto/param-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entity/comment.entity';
import { CommentRepository } from './repository/comment.repository';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(CommentRepository)
    private readonly commentRepository: CommentRepository,

    private readonly boardRepository: BoardRepository,

    private readonly errorConfirm: ErrorConfirm,
  ) {}

  async readAllComments(boardNo: number): Promise<Comment[]> {
    try {
      return await this.commentRepository.readAllComments(boardNo);
    } catch (err) {
      throw err;
    }
  }

  async createComment(
    boardNo: number,
    createCommentDto: CreateCommentDto,
  ): Promise<void> {
    try {
      const board = await this.boardRepository.findOne(boardNo);

      this.errorConfirm.notFoundError(
        board,
        '댓글을 작성하려는 게시글을 찾을 수 없습니다.',
      );

      const { affectedRows }: any = await this.commentRepository.createComment(
        board,
        createCommentDto,
      );

      this.errorConfirm.badGatewayError(affectedRows, '댓글 작성 실패');
    } catch (err) {
      throw err;
    }
  }

  async updateComment(
    boardAndCommentNo: ParamCommentDto,
    { content }: UpdateCommentDto,
  ): Promise<void> {
    try {
      const isUpdate: boolean = await this.commentRepository.updateComment(
        boardAndCommentNo,
        content,
      );

      this.errorConfirm.badGatewayError(isUpdate, '댓글 수정 실패');
    } catch (err) {
      throw err;
    }
  }

  async deleteComment(boardAndCommentNo: ParamCommentDto): Promise<void> {
    try {
      const isDelete: boolean = await this.commentRepository.deleteComment(
        boardAndCommentNo,
      );

      this.errorConfirm.badGatewayError(isDelete, '댓글 삭제 실패');
    } catch (err) {
      throw err;
    }
  }
}
