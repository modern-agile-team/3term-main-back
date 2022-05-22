import { InternalServerErrorException } from '@nestjs/common';
import { User } from 'src/auth/entity/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { Notice } from '../entity/notice.entity';

@EntityRepository(Notice)
export class NoticeRepository extends Repository<Notice> {
  async readAllNotices(): Promise<Notice[]> {
    try {
      const notices = this.createQueryBuilder('notices')
        .select([
          'notices.no',
          'notices.title',
          'notices.description',
          'notices.createdAt',
        ])
        .orderBy('notices.updatedAt', 'DESC')
        .getMany();

      return notices;
    } catch (e) {
      throw new InternalServerErrorException(
        e,
        '### 공지사항 전체 조회 에러 : 알 수 없는 서버 에러입니다.',
      );
    }
  }

  async createNotice({ title, description }, manager: User) {
    try {
      const { raw } = await this.createQueryBuilder('notices')
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
    } catch (e) {
      throw new InternalServerErrorException(
        e,
        '### 공지사항 작성 에러 : 알 수 업는 서버 에러입니다.',
      );
    }
  }

  async updateNotice(no: number, { title, description }, manager: User) {
    try {
      const { affected } = await this.createQueryBuilder()
        .update(Notice)
        .set({
          title,
          description,
          lastEditor: manager,
        })
        .where('no = :no', { no })
        .execute();

      return affected;
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async deleteNotice(no: number) {
    try {
      const { affected } = await this.createQueryBuilder()
        .softDelete()
        .from(Notice)
        .where('no = :no', { no })
        .execute();

      return affected;
    } catch (e) {
      throw new InternalServerErrorException(
        e,
        '### 공지사항 삭제 에러 : 알 수 없는 서버 에러엡니다.',
      );
    }
  }
}
