import { InternalServerErrorException } from '@nestjs/common';
import { EntityRepository, InsertResult, Repository } from 'typeorm';
import { ReportedUser } from '../entity/reported-user.entity';

@EntityRepository(ReportedUser)
export class ReportedUserRepository extends Repository<ReportedUser> {
  async readOneReportedUser(userNo: number): Promise<ReportedUser> {
    try {
      const reportUser: ReportedUser = await this.createQueryBuilder(
        'reportedUsers',
      )
        .leftJoin('reportedUsers.reportUser', 'reportUser')
        .leftJoin('reportedUsers.reportedUser', 'reportedUser')
        .leftJoin('reportedUsers.checks', 'checks')
        .leftJoin('checks.check', 'check')
        .select([
          'reportedUsers.no',
          'reportedUsers.description',
          'reportUser.no',
          'reportUser.email',
          'reportedUser.no',
          'reportedUser.email',
          'checks.no',
          'check.no',
          'check.content',
        ])
        .where('reportedUsers.no = :userNo', { userNo })
        .getOne();

      return reportUser;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async createUserReport(description: string): Promise<any> {
    try {
      const { raw }: InsertResult = await this.createQueryBuilder(
        'reported_users',
      )
        .insert()
        .into(ReportedUser)
        .values({ description })
        .execute();

      return raw;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }
}
