import { InternalServerErrorException } from '@nestjs/common';
import { User } from 'src/auth/entity/user.entity';
import {
  DeleteResult,
  EntityRepository,
  Repository,
  UpdateResult,
} from 'typeorm';
import { CreateNoticeDto } from '../dto/create-notice.dto';
import { UpdateNoticeDto } from '../dto/update-notice.dtd';
import { Notice } from '../entity/notice.entity';

@EntityRepository(Notice)
export class NoticeRepository extends Repository<Notice> {
  async readAllNotices(): Promise<Notice | Notice[]> {
    try {
      const notices: Notice | Notice[] = await this.createQueryBuilder(
        'notices',
      )
        .select([
          'notices.no',
          'notices.title',
          'notices.description',
          'notices.createdAt',
        ])
        .orderBy('notices.updatedAt', 'DESC')
        .getMany();

      return notices;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async createNotice(
    { title, description }: CreateNoticeDto,
    manager: User,
  ): Promise<any> {
    try {
      const { raw }: any = await this.createQueryBuilder('notices')
        .insert()
        .into(Notice)
        .values({
          manager,
          lastEditor: manager,
          title,
          description,
        })
        .execute();

      return raw;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async updateNotice(
    noticeNo: number,
    { title, description }: UpdateNoticeDto,
    manager: User,
  ): Promise<number> {
    try {
      const { affected }: UpdateResult = await this.createQueryBuilder()
        .update(Notice)
        .set({
          title,
          description,
          lastEditor: manager,
        })
        .where('no = :noticeNo', { noticeNo })
        .execute();

      return affected;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async deleteNotice(noticeNo: number): Promise<number> {
    try {
      const { affected }: DeleteResult = await this.createQueryBuilder()
        .softDelete()
        .from(Notice)
        .where('no = :noticeNo', { noticeNo })
        .execute();

      return affected;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }
}
