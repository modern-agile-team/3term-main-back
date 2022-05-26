import { InternalServerErrorException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { UserReportChecks } from '../entity/user-report-checks.entity';
import { BoardReportChecks } from '../entity/board-report-checks.entity';
import { ReportCheckbox } from '../../report-checkboxes/entity/report-checkboxes.entity';
import { ReportedBoard } from 'src/reports/entity/reported-board.entity';
import { ReportedUser } from 'src/reports/entity/reported-user.entity';

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
