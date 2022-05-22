import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entity/user.entity';
import { UserRepository } from 'src/auth/repository/user.repository';
import { ErrorConfirm } from 'src/common/utils/error';
import { CreateNoticeDto } from './dto/create-notice.dto';
import { UpdateNoticeDto } from './dto/update-notice.dtd';
import { Notice } from './entity/notice.entity';
import { NoticeRepository } from './repository/notice.repository';

@Injectable()
export class NoticesService {
  constructor(
    @InjectRepository(NoticeRepository)
    private noticeRepository: NoticeRepository,

    private userRepository: UserRepository,
    private readonly errorConfirm: ErrorConfirm,
  ) {}

  async readAllNotices(): Promise<Notice | Notice[]> {
    try {
      const notices: Notice | Notice[] =
        await this.noticeRepository.readAllNotices();

      this.errorConfirm.notFoundError(notices, '공지사항이 없습니다.');

      return notices;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async createNotice(
    createNoticeDto: CreateNoticeDto,
    manager: User,
  ): Promise<boolean> {
    try {
      const { affectedRows, insertId }: any =
        await this.noticeRepository.createNotice(createNoticeDto, manager);

      if (!affectedRows) {
        throw new BadGatewayException('공지사항 생성 실패');
      }

      await this.userRepository.userRelation(manager.no, insertId, 'notices');

      return true;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async updateNotice(
    noticeNo: number,
    updateNoticeDto: UpdateNoticeDto,
    manager: User,
  ): Promise<boolean> {
    try {
      const updateResult = await this.noticeRepository.updateNotice(
        noticeNo,
        updateNoticeDto,
        manager,
      );

      if (!updateResult) {
        throw new BadGatewayException('공지사항 수정 실패');
      }

      await this.userRepository.userRelation(
        manager.no,
        noticeNo,
        'modifiedNotices',
      );

      return true;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async deleteNotice(noticeNo: number): Promise<boolean> {
    try {
      const deleteResult: number = await this.noticeRepository.deleteNotice(
        noticeNo,
      );

      if (!deleteResult) {
        throw new BadGatewayException('공지사항 삭제 실패');
      }

      return true;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
