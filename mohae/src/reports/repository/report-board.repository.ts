import { EntityRepository, Repository } from 'typeorm';
import { CreateReportBoardDto } from '../dto/create-report-board.dto';
import { ReportBoard, ReportUser } from '../entity/report.entity';

@EntityRepository(ReportBoard)
export class ReportedBoardRepository extends Repository<ReportBoard> {
  async createBoardReport(
    createReportBoardDto: CreateReportBoardDto,
  ): Promise<ReportBoard> {
    const { boardNo, reportUserNo, firstNo, secondNo, thirdNo, description } =
      createReportBoardDto;

    const reportedBoard = this.create({
      board_no: boardNo,
      report_user_no: reportUserNo,
      first_no: firstNo,
      second_no: secondNo,
      third_no: thirdNo,
      description,
    });

    await reportedBoard.save();
    return reportedBoard;
  }
}
