import { EntityRepository, Repository } from 'typeorm';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { Comment } from '../entity/comment.entity';

@EntityRepository(Comment)
export class CommentRepository extends Repository<Comment> {
  async readAllComments(boardNo: number) {
    const comments = await this.createQueryBuilder('comments')
      .leftJoinAndSelect('comments.commentorNo', 'commentor')
      .leftJoinAndSelect('comments.boardNo', 'board')
      .where('board.no = :boardNo', { boardNo })
      .getMany();

    return comments;
  }

  async createComment(
    boardNo: number,
    { content, commentorNo }: CreateCommentDto,
  ) {
    const createResult = await this.createQueryBuilder('comments')
      .insert()
      .into(Comment)
      .values({ content, commentorNo, boardNo })
      .execute();

    return createResult;
  }
}
