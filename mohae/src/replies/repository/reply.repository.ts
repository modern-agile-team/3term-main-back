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
  async readAllReplies(commentNo: number): Promise<Reply[]> {
    try {
      const replies: Reply[] = await this.createQueryBuilder('replies')
        .leftJoin('replies.writer', 'writer')
        .leftJoin(
          'writer.profilePhoto',
          'writerPhoto',
          'writerPhoto.user = writer.no',
        )
        .select([
          'replies.no AS replyNo',
          'replies.content AS replyContent',
          'writer.no AS replyWriterNo',
          'writerPhoto.photo_url AS replyWriterPhotoUrl',
          `DATE_FORMAT(replies.createdAt,'%Y년 %m월 %d일') AS replyCreatedAt`,
        ])
        .where('replies.comment = :commentNo', { commentNo })
        .getRawMany();

      return replies;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }
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
    try {
      const { affected } = await this.createQueryBuilder('replies')
        .update(Reply)
        .set({ content })
        .where('replies.no = :replyNo', { replyNo })
        .execute();

      return !!affected;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async deleteReply(replyNo: number): Promise<boolean> {
    try {
      const { affected }: DeleteResult = await this.createQueryBuilder(
        'replies',
      )
        .delete()
        .from(Reply)
        .where('replies.no = :replyNo', { replyNo })
        .execute();

      return !!affected;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async findOneReplyOfUser(
    replyNo: number,
    loginUserNo: number,
  ): Promise<boolean> {
    try {
      const findedReply: Reply = await this.createQueryBuilder('replies')
        .leftJoin('replies.writer', 'writer')
        .select(['replies.no'])
        .where('replies.no = :replyNo', { replyNo })
        .andWhere('writer.no = :loginUserNo', { loginUserNo })
        .getOne();

      return !!findedReply;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }
}
