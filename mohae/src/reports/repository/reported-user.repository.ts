import { InternalServerErrorException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { ReportedUser } from '../entity/reported-user.entity';

@EntityRepository(ReportedUser)
export class ReportedUserRepository extends Repository<ReportedUser> {
  async readOneReportedUser(userNo: number): Promise<ReportedUser> {
    try {
      const reportUser = await this.createQueryBuilder('reported_users')
        .leftJoin('reported_users.reportUser', 'reportUser')
        .leftJoin('reported_users.reportedUser', 'reportedUser')
        .leftJoin('reported_users.checks', 'checks')
        .leftJoin('checks.check', 'check')
        .select([
          'reported_users.no',
          'reported_users.description',
          'reportUser.no',
          'reportUser.email',
          'reportedUser.no',
          'reportedUser.email',
          'checks.no',
          'check.no',
          'check.content',
        ])
        .where('reported_users.no = :userNo', { userNo })
        .getOne();

      return reportUser;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async readOneUserReportCheckRelation(no: number): Promise<any[]> {
    try {
      const relation = await this.createQueryBuilder()
        .relation(ReportedUser, 'checks')
        .of(no)
        .loadMany();

      return relation;
    } catch (e) {
      throw new InternalServerErrorException(
        `${e} ### 유저 신고 체크 릴레이션 : 알 수 없는 서버 에러입니다.`,
      );
    }
  }

  async createUserReport(description: string) {
    try {
      const { raw } = await this.createQueryBuilder('reported_users')
        .insert()
        .into(ReportedUser)
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
