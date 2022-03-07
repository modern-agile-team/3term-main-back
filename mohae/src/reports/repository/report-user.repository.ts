import { EntityRepository, Repository } from 'typeorm';
import { CreateReportUserDto } from '../dto/create-report-user.dto';
import { ReportUser } from '../entity/report.entity';

@EntityRepository(ReportUser)
export class ReportedUserRepository extends Repository<ReportUser> {
  async createBoardReport(
    createReportUserDto: CreateReportUserDto,
  ): Promise<ReportUser> {
    const {
      user_no,
      report_user_no,
      first_no,
      second_no,
      third_no,
      description,
    } = createReportUserDto;

    const reportedBoard = this.create({
      user_no,
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
