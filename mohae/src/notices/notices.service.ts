import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from 'src/auth/repository/user.repository';
import { CreateNoticeDto, UpdateNoticeDto } from './dto/notice.dto';
import { Notice } from './entity/notice.entity';
import { NoticeRepository } from './repository/notice.repository';

@Injectable()
export class NoticesService {
  constructor(
    @InjectRepository(NoticeRepository)
    private noticeRepository: NoticeRepository,

    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {}

  async readNotices(): Promise<Notice[]> {
    try {
      const notices = await this.noticeRepository.readNotices();

      return notices;
    } catch (e) {
      throw e;
    }
  }

  async createNotice(createNoticeDto: CreateNoticeDto) {
    try {
      const { managerNo } = createNoticeDto;
      const manager = await this.userRepository.findOne(managerNo, {
        relations: ['notices'],
      });
      const createdResult = await this.noticeRepository.createNotice(
        createNoticeDto,
        manager,
      );
      if (!createdResult.affectedRows) {
        return { success: false };
      }
      const notice = await this.noticeRepository.findOne(
        createdResult.insertId,
      );

      manager.notices.push(notice);

      await this.userRepository.save(manager);

      return { success: true };
    } catch (e) {
      throw e;
    }
  }

  async updateNotice(no: number, updateNoticeDto: UpdateNoticeDto) {
    try {
      const { managerNo } = updateNoticeDto;

      const manager = await this.userRepository.findOne(managerNo, {
        relations: ['modifyNotices'],
      });
      const updateResult = await this.noticeRepository.updateNotice(
        no,
        updateNoticeDto,
        manager,
      );

      const notice = await this.noticeRepository.findOne(no);
      manager.modifyNotices.push(notice);

      await this.userRepository.save(manager);

      return updateResult ? { success: true } : { success: false };
    } catch (e) {
      throw e;
    }
  }

  async deleteNotice(no: number) {
    try {
      const deleteResult = await this.noticeRepository.deleteNotice(no);

      if (!deleteResult) {
        throw new InternalServerErrorException('공지 삭제 실패');
      }
      return { success: true };
    } catch (e) {
      throw e;
    }
  }
}
