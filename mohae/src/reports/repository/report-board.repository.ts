import { EntityRepository, Repository } from 'typeorm';
import { CreateReportBoardDto } from '../dto/create-report-board.dto';
import { ReportBoard, ReportUser } from '../entity/report.entity';

@EntityRepository(ReportBoard)
export class ReportedBoardRepository extends Repository<ReportBoard> {
  async createBoardReport(
    createReportBoardDto: CreateReportBoardDto,
  ): Promise<ReportBoard> {
    const {
      board_no,
      report_user_no,
      first_no,
      second_no,
      third_no,
      description,
    } = createReportBoardDto;

    const reportedBoard = this.create({
      board_no,
      report_user_no,
      first_no,
      second_no,
      third_no,
      description,
    });

    await reportedBoard.save();
    return reportedBoard;
  }
}
