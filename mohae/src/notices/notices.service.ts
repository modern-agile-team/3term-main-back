import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entity/user.entity';
import { UserRepository } from 'src/auth/repository/user.repository';
import { ErrorConfirm } from 'src/common/utils/error';
import { Connection, QueryRunner } from 'typeorm';
import { CreateNoticeDto } from './dto/create-notice.dto';
import { SearchNoticesDto } from './dto/search-notice.dto';
import { UpdateNoticeDto } from './dto/update-notice.dtd';
import { Notice } from './entity/notice.entity';
import { NoticeRepository } from './repository/notice.repository';

@Injectable()
export class NoticesService {
  constructor(
    @InjectRepository(NoticeRepository)
    private noticeRepository: NoticeRepository,

    private readonly connection: Connection,
    private readonly errorConfirm: ErrorConfirm,
  ) {}

  async readAllNotices(take: number): Promise<Notice | Notice[]> {
    try {
      const notices: Notice | Notice[] =
        await this.noticeRepository.readAllNotices(take);

      this.errorConfirm.notFoundError(notices, '공지사항이 없습니다.');

      return notices;
    } catch (err) {
      throw err;
    }
  }

  async createNotice(
    createNoticeDto: CreateNoticeDto,
    manager: User,
  ): Promise<void> {
    const queryRunner: QueryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { affectedRows, insertId }: any = await queryRunner.manager
        .getCustomRepository(NoticeRepository)
        .createNotice(createNoticeDto, manager);

      this.errorConfirm.badGatewayError(affectedRows, '공지사항 생성 실패');

      await queryRunner.manager
        .getCustomRepository(UserRepository)
        .userRelation(manager.no, insertId, 'notices');

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async updateNotice(
    manager: User,
    noticeNo: number,
    updateNoticeDto: UpdateNoticeDto,
  ): Promise<void> {
    const queryRunner: QueryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const updatedResult: number = await queryRunner.manager
        .getCustomRepository(NoticeRepository)
        .updateNotice(noticeNo, updateNoticeDto, manager);

      this.errorConfirm.badGatewayError(updatedResult, '공지사항 수정 실패');

      await queryRunner.manager
        .getCustomRepository(UserRepository)
        .userRelation(manager.no, noticeNo, 'modifiedNotices');

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async deleteNotice(noticeNo: number): Promise<void> {
    try {
      const deleteResult: number = await this.noticeRepository.deleteNotice(
        noticeNo,
      );

      this.errorConfirm.badGatewayError(deleteResult, '공지사항 삭제 실패');
    } catch (err) {
      throw err;
    }
  }

  async searchNotices(
    searchNoticesDto: SearchNoticesDto,
  ): Promise<Notice | Notice[]> {
    const searchedNotices: Notice | Notice[] =
      await this.noticeRepository.searchNotices(searchNoticesDto);

    return searchedNotices;
  }
}
