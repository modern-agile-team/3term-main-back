import { InternalServerErrorException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import {
  BoardReportChecks,
  UserReportChecks,
} from '../entity/report-checks.entity';
import {
  ReportCheckbox,
  ReportedBoard,
  ReportedUser,
} from '../entity/report.entity';

@EntityRepository(ReportedBoard)
export class ReportedBoardRepository extends Repository<ReportedBoard> {
  async readOneReportedBoard(no: number): Promise<ReportedBoard> {
    try {
      const reportBoard = await this.createQueryBuilder('reported_boards')
        .leftJoinAndSelect('reported_boards.reportUser', 'reportUser')
        .leftJoinAndSelect('reported_boards.reportedBoard', 'reportedBoard')
        .leftJoinAndSelect('reported_boards.checks', 'checks')
        .leftJoinAndSelect('checks.check', 'check')
        .where('reported_boards.no = :no', { no })
        .getOne();

      return reportBoard;
    } catch (e) {
      throw new InternalServerErrorException(
        `${e} ### 신고 내역(게시글) 조회 : 알 수 없는 서버 에러입니다.`,
      );
    }
  }

  async createBoardReport(description: string) {
    try {
      const { raw } = await this.createQueryBuilder('reported_boards')
        .insert()
        .into(ReportedBoard)
        .values({ description })
        .execute();

      return raw;
    } catch (e) {
      throw new InternalServerErrorException(
        `${e} ### 게시글 신고 : 알 수 없는 서버 에러입니다.`,
      );
    }
  }
}

@EntityRepository(ReportedUser)
export class ReportedUserRepository extends Repository<ReportedUser> {
  async readOneReportedUser(no: number): Promise<ReportedUser> {
    try {
      const reportUser = await this.createQueryBuilder('reported_users')
        .leftJoin('reported_users.reportUser', 'reportUser')
        .leftJoin('reported_users.reportedUser', 'reportedUser')
        .leftJoin('reported_users.checks', 'checks')
        .where('reported_users.no = :no', { no })
        .getOne();

      return reportUser;
    } catch (e) {
      throw new InternalServerErrorException(
        `${e} ### 신고 내역(유저) 조회 : 알 수 없는 서버 에러입니다.`,
      );
    }
  }

  async readOneUserReportCheckRelation(no: number): Promise<any[]> {
    try {
      const relation = await this.createQueryBuilder()
        .relation(ReportedUser, 'checks')
        .of(no)
        .loadMany();

      return relation;
    } catch (e) {
      throw new InternalServerErrorException(
        `${e} ### 유저 신고 체크 릴레이션 : 알 수 없는 서버 에러입니다.`,
      );
    }
  }

  async createUserReport(description: string) {
    try {
      const { raw } = await this.createQueryBuilder('reported_users')
        .insert()
        .into(ReportedUser)
        .values({ description })
        .execute();

      return raw;
    } catch (e) {
      throw new InternalServerErrorException(
        `${e} ### 게시글 신고 : 알 수 없는 서버 에러입니다.`,
      );
    }
  }
}

@EntityRepository(ReportCheckbox)
export class ReportCheckboxRepository extends Repository<ReportCheckbox> {
  async readAllCheckboxes(): Promise<ReportCheckbox[]> {
    try {
      const checkedReport = this.createQueryBuilder('report_checkboxes')
        .leftJoin('report_checkboxes.reportedBoards', 'boardReportChecks')
        .leftJoin('boardReportChecks.reportedBoard', 'reportedBoard')
        .leftJoin('report_checkboxes.reportedUsers', 'userReportChecks')
        .leftJoin('userReportChecks.reportedUser', 'reportedUser')
        .select([
          'report_checkboxes.no',
          'report_checkboxes.content',
          'boardReportChecks.no',
          'reportedBoard.no',
          'reportedBoard.description',
          'userReportChecks.no',
          'reportedUser.no',
          'reportedUser.description',
        ])
        .getMany();

      return checkedReport;
    } catch (e) {
      throw new InternalServerErrorException(
        `${e} ### 체크박스 전체 조회 : 알 수 없는 서버 에러입니다.`,
      );
    }
  }

  async selectCheckConfirm(no: number) {
    try {
      const checkInfo = await this.createQueryBuilder('report_checkboxes')
        .select()
        .where('report_checkboxes.no = :no', { no })
        .getOne();

      return checkInfo;
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
}

@EntityRepository(BoardReportChecks)
export class BoardReportChecksRepository extends Repository<BoardReportChecks> {
  async saveBoardReportChecks(
    reportedBoard: ReportedBoard,
    check: ReportCheckbox,
  ) {
    try {
      await this.createQueryBuilder('board_report_checks')
        .insert()
        .into(BoardReportChecks)
        .values({ reportedBoard, check })
        .execute();
    } catch (e) {
      throw new InternalServerErrorException('BoardReportChecks 에러');
    }
  }
}

@EntityRepository(UserReportChecks)
export class UserReportChecksRepository extends Repository<UserReportChecks> {
  async saveUserReportChecks(
    reportedUser: ReportedUser,
    check: ReportCheckbox,
  ) {
    try {
      await this.createQueryBuilder('user_report_checks')
        .insert()
        .into(UserReportChecks)
        .values({ reportedUser, check })
        .execute();
    } catch (e) {
      throw new InternalServerErrorException('UserReportChecks 에러');
    }
  }
}
