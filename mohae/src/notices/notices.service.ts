import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from 'src/auth/repository/user.repository';
import { CreateNoticeDto, UpdateNoticeDto } from './dto/notice.dto';
import { NoticeRepository } from './repository/notice.repository';

@Injectable()
export class NoticesService {
  constructor(
    @InjectRepository(NoticeRepository)
    private noticeRepository: NoticeRepository,

    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {}

  async readNotices() {
    const notices = await this.noticeRepository.readNotices();

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

  async updateNotice(no: number, updateNoticeDto: UpdateNoticeDto) {
    try {
      const { modifiedManagerNo } = updateNoticeDto;
      const manager = await this.userRepository.findOne(modifiedManagerNo, {
        relations: ['modifyNotices'],
      });
      const result = await this.noticeRepository.updateNotice(
        no,
        updateNoticeDto,
        manager,
      );

      const notice = await this.noticeRepository.findOne(no);
      manager.modifyNotices.push(notice);

      await this.userRepository.save(manager);

      return result ? { success: true } : { success: false };
    } catch (e) {
      throw e;
    }
  }

  async deleteNotice(no: number) {
    try {
      const result = await this.noticeRepository.deleteNotice(no);

      if (!result) {
        throw new NotFoundException('해당 공지사항을 찾을 수 없습니다.');
      }
      return { success: true };
    } catch (e) {
      throw e;
    }
  }
}
