import { InternalServerErrorException } from '@nestjs/common';
import { EntityRepository, InsertResult, Repository } from 'typeorm';
import { UserReportChecks } from '../entity/user-report-checks.entity';
import { ReportCheckbox } from '../../report-checkboxes/entity/report-checkboxes.entity';
import { ReportedUser } from 'src/reports/entity/reported-user.entity';

@EntityRepository(UserReportChecks)
export class UserReportChecksRepository extends Repository<UserReportChecks> {
  async saveUserReportChecks(
    reportedUser: ReportedUser,
    check: ReportCheckbox,
  ): Promise<any> {
    try {
      const { raw }: InsertResult = await this.createQueryBuilder(
        'user_report_checks',
      )
        .insert()
        .into(UserReportChecks)
        .values({ reportedUser, check })
        .execute();

      return raw;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }
}
