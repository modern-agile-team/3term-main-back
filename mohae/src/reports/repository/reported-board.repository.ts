import { InternalServerErrorException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { ReportedBoard } from '../entity/reported-board.entity';

@EntityRepository(ReportedBoard)
export class ReportedBoardRepository extends Repository<ReportedBoard> {
  async readOneReportedBoard(no: number): Promise<ReportedBoard> {
    try {
      const reportBoard = await this.createQueryBuilder('reported_boards')
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
