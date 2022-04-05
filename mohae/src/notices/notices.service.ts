import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from 'src/auth/repository/user.repository';
import { CreateNoticeDto } from './dto/notice.dto';
import { NoticeRepository } from './repository/notice.repository';

@Injectable()
export class NoticesService {
  constructor(
    @InjectRepository(NoticeRepository)
    private noticeRepository: NoticeRepository,

    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {}

  async getAllNotices() {
    const notices = await this.noticeRepository.getAllNotices();

    return notices;
  }

  async createNotice(createNoticeDto: CreateNoticeDto) {
    try {
      const { managerNo } = createNoticeDto;
      const manager = await this.userRepository.findOne(managerNo, {
        relations: ['notices'],
      });
      const result = await this.noticeRepository.createNotice(
        createNoticeDto,
        manager,
      );
      if (!result.affectedRows) {
        return { success: false };
      }
      const notice = await this.noticeRepository.findOne(result.insertId);

      manager.notices.push(notice);

      await this.userRepository.save(manager);

      return { success: true };
    } catch (e) {
      throw e;
    }
  }

  async deleteNotice(no: number) {
    try {
      const result = await this.noticeRepository.deleteNotice(no);

      if (result) {
        return { success: true };
      }

      return { success: false };
    } catch (e) {
      throw e;
    }
  }
}
