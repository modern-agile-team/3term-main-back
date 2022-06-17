import { InternalServerErrorException } from '@nestjs/common';
import { Board } from 'src/boards/entity/board.entity';
import {
  DeleteResult,
  EntityRepository,
  InsertResult,
  Repository,
  UpdateResult,
} from 'typeorm';
import { Comment } from '../entity/comment.entity';

@EntityRepository(Comment)
export class CommentRepository extends Repository<Comment> {
  async readAllComments(
    boardNo: number,
    loginUserNo: number,
  ): Promise<Comment[]> {
    try {
      const comments: Comment[] = await this.createQueryBuilder('comments')
        .leftJoin(
          'comments.commenter',
          'commenter',
          'comments.commenter = commenter.no',
        )
        .leftJoin('comments.board', 'board', 'board.no = :boardNo', { boardNo })
        .leftJoin(
          'commenter.profilePhoto',
          'commenterPhoto',
          'commenterPhoto.user = commenter.no',
        )
        .select([
          'comments.no AS commentNo',
          'comments.content AS commentContent',
          `DATE_FORMAT(comments.createdAt, '%Y년 %m월 %d일') AS commentCreatedAt`,
          'commenter.no AS commenterNo',
          'commenter.nickname AS commenterNickname',
          'commenterPhoto.photo_url AS commenterPhotoUrl',
          `IF(commenter.no = ${loginUserNo}, true, false) AS isCommenter`,
        ])
        .getRawMany();

      return comments;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async createComment(board: Board, content: string): Promise<InsertResult> {
    try {
      const { raw }: InsertResult = await this.createQueryBuilder('comments')
        .insert()
        .into(Comment)
        .values({ content, board })
        .execute();

      return raw;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async updateComment(commentNo: number, content: string): Promise<boolean> {
    try {
      const { affected }: UpdateResult = await this.createQueryBuilder(
        'comments',
      )
        .update(Comment)
        .set({ content })
        .where('comments.no = :commentNo', { commentNo })
        .execute();

      return !!affected;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async deleteComment(commentNo: number): Promise<boolean> {
    try {
      const { affected }: DeleteResult = await this.createQueryBuilder(
        'comments',
      )
        .delete()
        .from(Comment)
        .where('comments.no = :commentNo', { commentNo })
        .execute();

      return !!affected;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async findOneCommentOfUser(
    commentNo: number,
    loginUserNo: number,
  ): Promise<boolean> {
    try {
      const findedComment: Comment = await this.createQueryBuilder('comments')
        .leftJoin('comments.commenter', 'commenter')
        .select(['comments.no'])
        .where('comments.no = :commentNo', { commentNo })
        .andWhere('commenter.no = :loginUserNo', { loginUserNo })
        .getOne();

      return !!findedComment;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }
}
