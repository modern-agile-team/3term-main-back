import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NoticeRepository } from './repository/notice.repository';

@Injectable()
export class NoticesService {
  constructor(
    @InjectRepository(NoticeRepository)
    private noticeRepository: NoticeRepository,
  ) {}

  async getAllNotices() {
    const notices = await this.noticeRepository.getAllNotices();

    return notices;
  }
}
