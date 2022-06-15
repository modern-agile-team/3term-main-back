import { InternalServerErrorException } from '@nestjs/common';
import { Board } from 'src/boards/entity/board.entity';
import {
  DeleteResult,
  EntityRepository,
  InsertResult,
  Repository,
  UpdateResult,
} from 'typeorm';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { ParamCommentDto } from '../dto/param-comment.dto';
import { Comment } from '../entity/comment.entity';

@EntityRepository(Comment)
export class CommentRepository extends Repository<Comment> {
  async readAllComments(boardNo: number): Promise<Comment[]> {
    try {
      const comments: Comment[] = await this.createQueryBuilder('comments')
        // .leftJoinAndSelect('comments.commentor_no', 'commentor')
        .leftJoin('comments.board', 'board', 'board.no = :boardNo', { boardNo })
        .select(['comments.no', 'comments.content', 'board.no'])
        .getMany();

      return comments;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async createComment(
    boardNo: Board,
    { content, commentorNo }: CreateCommentDto,
  ): Promise<InsertResult> {
    try {
      const { raw }: InsertResult = await this.createQueryBuilder('comments')
        .insert()
        .into(Comment)
        .values({ content, commentorNo, board: boardNo })
        .execute();

      return raw;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async updateComment(
    { boardNo, commentNo }: ParamCommentDto,
    content: string,
  ): Promise<boolean> {
    try {
      const { affected }: UpdateResult = await this.createQueryBuilder(
        'comments',
      )
        .update(Comment)
        .set({ no: commentNo, content })
        .where('comments.no = :commentNo', { commentNo })
        .andWhere('comments.board_no = :boardNo', { boardNo })
        .execute();

      return !!affected;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async deleteComment({
    boardNo,
    commentNo,
  }: ParamCommentDto): Promise<boolean> {
    try {
      const { affected }: DeleteResult = await this.createQueryBuilder(
        'comments',
      )
        .delete()
        .from(Comment)
        .where('comments.no = :commentNo', { commentNo })
        .andWhere('comments.board_no = :boardNo', { boardNo })
        .execute();

      return !!affected;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }
}
