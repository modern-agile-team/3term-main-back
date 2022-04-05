import { EntityRepository, Repository } from 'typeorm';
import { Notice } from '../entity/notice.entity';

@EntityRepository(Notice)
export class NoticeRepository extends Repository<Notice> {
  async getAllNotices() {
    const notices = this.createQueryBuilder().getMany();

    return notices;
  }
}
