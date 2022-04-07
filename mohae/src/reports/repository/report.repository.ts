import { InternalServerErrorException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { CreateReportDto } from '../dto/report.dto';
import {
  ReportCheckbox,
  ReportedBoard,
  ReportedUser,
} from '../entity/report.entity';

@EntityRepository(ReportedBoard)
export class ReportedBoardRepository extends Repository<ReportedBoard> {
  async readOneReportedBoard(no: number): Promise<ReportedBoard> {
    try {
      const reportBoard = await this.createQueryBuilder('reported_boards')
        .leftJoinAndSelect('reported_boards.reportUser', 'reportUser')
        .leftJoinAndSelect('reported_boards.reportedBoard', 'boards')
        .leftJoinAndSelect('reported_boards.checks', 'checks')
        .where('reported_boards.no = :no', { no })
        .getOne();

      return reportBoard;
    } catch (e) {
      throw new InternalServerErrorException(
        `${e} ### 신고 내역(게시글) 조회 : 알 수 없는 서버 에러입니다.`,
      );
    }
  }

  async readOneBoardReportRelation(no: number): Promise<any[]> {
    try {
      const relation = await this.createQueryBuilder()
        .relation(ReportedBoard, 'checks')
        .of(no)
        .loadMany();

      return relation;
    } catch (e) {
      throw new InternalServerErrorException(
        `${e} ### 게시글 신고 릴레이션 : 알 수 없는 서버 에러입니다.`,
      );
    }
  }

  async createBoardReport(createReportDto: CreateReportDto) {
    const { description } = createReportDto;

    try {
      const { raw } = await this.createQueryBuilder('reported_boards')
        .insert()
        .into(ReportedBoard)
        .values({ description })
        .execute();
      const { insertId, affectedRows } = raw;

      if (!affectedRows) {
        throw new InternalServerErrorException(
          '게시글 신고가 접수되지 않았습니다.',
        );
      }

      return insertId;
    } catch (e) {
      throw new InternalServerErrorException(
        `${e} ### 게시글 신고 : 알 수 없는 서버 에러입니다.`,
      );
    }
  }
}

@EntityRepository(ReportedUser)
export class ReportedUserRepository extends Repository<ReportedUser> {
  async readOneReportedUser(no: number): Promise<ReportedUser> {
    try {
      const reportUser = await this.createQueryBuilder('reported_users')
        .leftJoinAndSelect('reported_users.reportUser', 'reportUser')
        .leftJoinAndSelect('reported_users.reportedUser', 'reportedUser')
        .leftJoinAndSelect('reported_users.checks', 'checks')
        .where('reported_users.no = :no', { no })
        .getOne();

      return reportUser;
    } catch (e) {
      throw new InternalServerErrorException(
        `${e} ### 신고 내역(유저) 조회 : 알 수 없는 서버 에러입니다.`,
      );
    }
  }

  async readOneReportUserRelation(no: number) {
    try {
      const relation = await this.createQueryBuilder()
        .relation(ReportedUser, 'reportUser')
        .of(no)
        .loadMany();

      return relation;
    } catch (e) {
      throw new InternalServerErrorException(
        `${e} ### 유저 신고한 유저 릴레이션 : 알 수 없는 서버 에러입니다.`,
      );
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

  async createUserReport(createReportDto: CreateReportDto) {
    const { description } = createReportDto;

    try {
      const reportedUser = this.create({
        description,
      });

      await reportedUser.save();

      return reportedUser;
    } catch (e) {
      throw new InternalServerErrorException(
        `${e} ### 게시글 신고 : 알 수 없는 서버 에러입니다.`,
      );
    }
  }
}

@EntityRepository(ReportCheckbox)
export class ReportCheckBoxRepository extends Repository<ReportCheckbox> {
  async readAllCheckboxes(): Promise<ReportCheckbox[]> {
    try {
      const checkedReport = this.createQueryBuilder('report_checkboxes')
        .leftJoinAndSelect('report_checkboxes.reportedBoards', 'reportedBoard')
        .leftJoinAndSelect('report_checkboxes.reportedUsers', 'reportedUser')
        .leftJoinAndSelect('reportedBoard.reportedBoard', 'board')
        .leftJoinAndSelect('reportedUser.reportedUser', 'user')
        .leftJoinAndSelect('reportedBoard.reportUser', 'boardReportUser')
        .leftJoinAndSelect('reportedUser.reportUser', 'userReportUser')
        .leftJoinAndSelect('reportedBoard.checks', 'checkedBoardReport')
        .leftJoinAndSelect('reportedUser.checks', 'checkedUserReport')
        .getMany();

      return checkedReport;
    } catch (e) {
      throw new InternalServerErrorException(
        `${e} ### 체크박스 전체 조회 : 알 수 없는 서버 에러입니다.`,
      );
    }
  }

  async selectCheckConfirm(checks: Array<number>) {
    try {
      const checkInfo = [];

      // checks.forEach(async (no) => {
      //   const info = await this.createQueryBuilder('report_checkboxes')
      //     .select()
      //     .where('report_checkboxes.no = :no', { no })
      //     .getOne();
      //   console.log(no, info);
      //   checkInfo.push(info);
      //   console.log('rr', checkInfo);
      // });
      // const checkInfo = {
      //   first: await this.createQueryBuilder('report_checkboxes')
      //     .select()
      //     .where('report_checkboxes.no = :no', { no: checks[0] })
      //     .getOne(),
      //   second: await this.createQueryBuilder('report_checkboxes')
      //     .select()
      //     .where('report_checkboxes.no = :no', { no: checks[1] })
      //     .getOne(),
      //   third: await this.createQueryBuilder('report_checkboxes')
      //     .select()
      //     .where('report_checkboxes.no = :no', { no: checks[2] })
      //     .getOne(),
      // };

      return checkInfo;
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async selectCheckConfirm2(no: number) {
    try {
      const checkInfo = await this.createQueryBuilder('report_checkboxes')
        .select()
        .where('report_checkboxes.no = :no', { no })
        .getOne();

      return checkInfo;
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async saveChecks(checks, newBoardReport, relationName: string) {
    try {
      const { no } = checks;
      const relation = await this.findOne(no, {
        relations: [relationName],
      });

      relation[relationName].push(newBoardReport);

      this.save(relation);
    } catch (e) {
      throw new InternalServerErrorException(
        `${e} ### 체크 박스 저장 : 알 수 없는 서버 에러입니다.`,
      );
    }
  }
}
