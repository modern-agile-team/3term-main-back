import { InternalServerErrorException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { CreateNoticeDto } from '../dto/notice.dto';
import { Notice } from '../entity/notice.entity';

@EntityRepository(Notice)
export class NoticeRepository extends Repository<Notice> {
  async getAllNotices() {
    try {
      const notices = this.createQueryBuilder('notices')
        .leftJoinAndSelect('notices.manager', 'manager')
        .leftJoinAndSelect('notices.modifiedManager', 'modifiedManager')
        .getMany();

      return notices;
    } catch (e) {
      throw new InternalServerErrorException(
        e,
        '### 공지사항 전체 조회 에러 : 알 수 없는 서버 에러입니다.',
      );
    }
  }

  async createNotice({ title, description }, manager) {
    try {
      const { raw } = await this.createQueryBuilder('notices')
        .insert()
        .into(Notice)
        .values({
          manager,
          modifiedManager: manager,
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

  async deleteNotice(no: number) {
    const result = 0;
  }
}
