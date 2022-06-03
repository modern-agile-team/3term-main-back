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
import { Connection } from 'typeorm';
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

    private readonly connection: Connection,
    private readonly errorConfirm: ErrorConfirm,
  ) {}

  async readAllNotices(): Promise<Notice | Notice[]> {
    try {
      const notices: Notice | Notice[] =
        await this.noticeRepository.readAllNotices();

      this.errorConfirm.notFoundError(notices, '공지사항이 없습니다.');

      return notices;
    } catch (err) {
      throw err;
    }
  }

  async createNotice(
    createNoticeDto: CreateNoticeDto,
    manager: User,
  ): Promise<boolean> {
    const queryRunner: any = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { affectedRows, insertId }: any = await queryRunner.manager
        .getCustomRepository(NoticeRepository)
        .createNotice(createNoticeDto, manager);

      if (!affectedRows) {
        throw new BadGatewayException('공지사항 생성 실패');
      }

      await queryRunner.manager
        .getCustomRepository(UserRepository)
        .userRelation(manager.no, insertId, 'notices');

      await queryRunner.commitTransaction();
      return true;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async updateNotice(
    noticeNo: number,
    updateNoticeDto: UpdateNoticeDto,
    manager: User,
  ): Promise<boolean> {
    const queryRunner: any = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const updateResult = await queryRunner.manager
        .getCustomRepository(NoticeRepository)
        .updateNotice(noticeNo, updateNoticeDto, manager);

      if (!updateResult) {
        throw new BadGatewayException('공지사항 수정 실패');
      }

      await queryRunner.manager
        .getCustomRepository(UserRepository)
        .userRelation(manager.no, noticeNo, 'modifiedNotices');

      await queryRunner.commitTransaction();
      return true;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
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
      throw err;
    }
  }
}
