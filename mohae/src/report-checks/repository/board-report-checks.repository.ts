import { InternalServerErrorException } from '@nestjs/common';
import { EntityRepository, InsertResult, Repository } from 'typeorm';
import { BoardReportChecks } from '../entity/board-report-checks.entity';
import { ReportCheckbox } from '../../report-checkboxes/entity/report-checkboxes.entity';
import { ReportedBoard } from 'src/reports/entity/reported-board.entity';

@EntityRepository(BoardReportChecks)
export class BoardReportChecksRepository extends Repository<BoardReportChecks> {
  async saveBoardReportChecks(
    reportedBoard: ReportedBoard,
    check: ReportCheckbox,
  ): Promise<boolean> {
    try {
      const { raw }: InsertResult = await this.createQueryBuilder(
        'board_report_checks',
      )
        .insert()
        .into(BoardReportChecks)
        .values({ reportedBoard, check })
        .execute();

      return !!raw.affectedRows;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }
}
