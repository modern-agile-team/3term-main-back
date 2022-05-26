import { InternalServerErrorException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { ReportCheckbox } from '../entity/report-checkboxes.entity';

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
