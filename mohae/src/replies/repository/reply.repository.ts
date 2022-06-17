import { InternalServerErrorException } from '@nestjs/common';
import { Comment } from 'src/comments/entity/comment.entity';
import {
  DeleteResult,
  EntityRepository,
  InsertResult,
  Repository,
} from 'typeorm';
import { Reply } from '../entity/reply.entity';

@EntityRepository(Reply)
export class ReplyRepository extends Repository<Reply> {
  async createReply(comment: Comment, content: string): Promise<InsertResult> {
    try {
      const { raw }: InsertResult = await this.createQueryBuilder('replies')
        .insert()
        .into(Reply)
        .values({ content, comment })
        .execute();

      return raw;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async updateReply(replyNo: number, content: string): Promise<boolean> {
    const { affected } = await this.createQueryBuilder('replies')
      .update(Reply)
      .set({ content })
      .where('replies.no = :replyNo', { replyNo })
      .execute();

    return !!affected;
  }

  async deleteReply(replyNo: number): Promise<boolean> {
    const { affected }: DeleteResult = await this.createQueryBuilder('replies')
      .delete()
      .from(Reply)
      .where('replies.no = :replyNo', { replyNo })
      .execute();

    return !!affected;
  }

  async findOneReplyOfUser(
    replyNo: number,
    loginUserNo: number,
  ): Promise<boolean> {
    const findedReply: Reply = await this.createQueryBuilder('replies')
      .leftJoin('replies.writer', 'writer')
      .select(['replies.no'])
      .where('replies.no = :replyNo', { replyNo })
      .andWhere('writer.no = :loginUserNo', { loginUserNo })
      .getOne();

    return !!findedReply;
  }
}
