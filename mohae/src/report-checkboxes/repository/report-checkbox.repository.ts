import { InternalServerErrorException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { ReportCheckbox } from '../entity/report-checkboxes.entity';

@EntityRepository(ReportCheckbox)
export class ReportCheckboxRepository extends Repository<ReportCheckbox> {
  async readAllCheckboxes(): Promise<any> {
    try {
      const checkedReport: ReportCheckbox[] = await this.createQueryBuilder(
        'report_checkboxes',
      )
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
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async selectCheckConfirm(checkNo: number): Promise<ReportCheckbox> {
    try {
      const checkInfo: ReportCheckbox = await this.createQueryBuilder(
        'report_checkboxes',
      )
        .select()
        .where('report_checkboxes.no = :checkNo', { checkNo })
        .getOne();

      return checkInfo;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }
}
