import { InternalServerErrorException } from '@nestjs/common';
import { User } from '@sentry/node';
import { Board } from 'src/boards/entity/board.entity';
import { EntityRepository, InsertResult, Repository } from 'typeorm';
import { ReportedBoard } from '../entity/reported-board.entity';

@EntityRepository(ReportedBoard)
export class ReportedBoardRepository extends Repository<ReportedBoard> {
  async readOneReportedBoard(boardNo: number): Promise<ReportedBoard> {
    try {
      const reportBoard: ReportedBoard = await this.createQueryBuilder(
        'reported_boards',
      )
        .leftJoin('reported_boards.reportUser', 'reportUser')
        .leftJoin('reported_boards.reportedBoard', 'reportedBoard')
        .leftJoin('reported_boards.checks', 'checks')
        .leftJoin('checks.check', 'check')
        .select([
          'reported_boards.no',
          'reported_boards.description',
          'reportUser.no',
          'reportUser.email',
          'reportedBoard.no',
          'reportedBoard.title',
          'checks.no',
          'check.no',
          'check.content',
        ])
        .where('reported_boards.no = :boardNo', { boardNo })
        .getOne();

      return reportBoard;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async createBoardReport(
    reportUser: User,
    reportedBoard: Board,
    description: string,
  ): Promise<any> {
    try {
      const reportedBoardData: object = {
        reportUser,
        reportedBoard,
        description,
      };

      const { raw }: InsertResult = await this.createQueryBuilder(
        'reported_boards',
      )
        .insert()
        .into(ReportedBoard)
        .values(reportedBoardData)
        .execute();

      return raw;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }
}
