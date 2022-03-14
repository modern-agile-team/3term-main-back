import { EntityRepository, Repository } from 'typeorm';
import {
  CreateReportBoardDto,
  CreateReportUserDto,
} from '../dto/create-report.dto';
import { ReportedBoard, ReportedUser } from '../entity/report.entity';

@EntityRepository(ReportedBoard)
export class ReportedBoardRepository extends Repository<ReportedBoard> {
  async createBoardReport(
    createReportBoardDto: CreateReportBoardDto,
  ): Promise<ReportedBoard> {
    const {
      reportedBoardNo,
      reportUserNo,
      firstNo,
      secondNo,
      thirdNo,
      description,
    } = createReportBoardDto;

    const reportedBoard = this.create({
      reportedBoard: reportedBoardNo,
      reportUser: reportUserNo,
      first_no: firstNo,
      second_no: secondNo,
      third_no: thirdNo,
      description,
    });

    await reportedBoard.save();
    return reportedBoard;
  }
}

@EntityRepository(ReportedUser)
export class ReportedUserRepository extends Repository<ReportedUser> {
  async createUserReport(
    createReportUserDto: CreateReportUserDto,
  ): Promise<ReportedUser> {
    const {
      reportedUserNo,
      reportUserNo,
      firstNo,
      secondNo,
      thirdNo,
      description,
    } = createReportUserDto;

    const reportedBoard = this.create({
      reportedUser: reportedUserNo,
      reportUser: reportUserNo,
      first_no: firstNo,
      second_no: secondNo,
      third_no: thirdNo,
      description,
    });

    await reportedBoard.save();
    return reportedBoard;
  }
}
