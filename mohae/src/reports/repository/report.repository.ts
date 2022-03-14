import { EntityRepository, Repository } from 'typeorm';
import {
  CreateReportBoardDto,
  CreateReportUserDto,
} from '../dto/create-report.dto';
import { ReportBoard, ReportUser } from '../entity/report.entity';

@EntityRepository(ReportBoard)
export class ReportedBoardRepository extends Repository<ReportBoard> {
  async createBoardReport(
    createReportBoardDto: CreateReportBoardDto,
  ): Promise<ReportBoard> {
    const { boardNo, reportUserNo, firstNo, secondNo, thirdNo, description } =
      createReportBoardDto;

    const reportedBoard = this.create({
      board: boardNo,
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

@EntityRepository(ReportUser)
export class ReportedUserRepository extends Repository<ReportUser> {
  async createUserReport(
    createReportUserDto: CreateReportUserDto,
  ): Promise<ReportUser> {
    const { userNo, reportUserNo, firstNo, secondNo, thirdNo, description } =
      createReportUserDto;

    const reportedBoard = this.create({
      user_no: userNo,
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
