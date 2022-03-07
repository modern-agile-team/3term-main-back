import { EntityRepository, Repository } from 'typeorm';
import { CreateReportUserDto } from '../dto/create-report-user.dto';
import { ReportUser } from '../entity/report.entity';

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
