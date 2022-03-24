import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { CreateReportDto } from '../dto/create-report.dto';
import {
  ReportCheckBox,
  ReportedBoard,
  ReportedUser,
} from '../entity/report.entity';

@EntityRepository(ReportedBoard)
export class ReportedBoardRepository extends Repository<ReportedBoard> {
  async findOneReportBoard(no: number): Promise<ReportedBoard> {
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

  async createBoardReport(checks, createReportDto: CreateReportDto) {
    const { description } = createReportDto;

    try {
      const reportedBoard = this.create({
        checks,
        description,
      });

      await reportedBoard.save();
      return reportedBoard;
    } catch (e) {
      throw new InternalServerErrorException(
        `${e} ### 게시글 신고 : 알 수 없는 서버 에러입니다.`,
      );
    }
  }
}

@EntityRepository(ReportedUser)
export class ReportedUserRepository extends Repository<ReportedUser> {
  async findOneReportUser(no: number): Promise<ReportedUser> {
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

  async createUserReport(checks, createReportDto: CreateReportDto) {
    const { description } = createReportDto;

    try {
      const reportedUser = this.create({
        checks,
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

@EntityRepository(ReportCheckBox)
export class ReportCheckBoxRepository extends Repository<ReportCheckBox> {
  async findAllCheckbox(): Promise<ReportCheckBox[]> {
    try {
      const checkedReport = this.createQueryBuilder('report_checkboxes')
        .leftJoinAndSelect('report_checkboxes.reportedBoards', 'reportedBoard')
        .leftJoinAndSelect('report_checkboxes.reportedUsers', 'reportedUser')
        .leftJoinAndSelect('reportedBoard.reportedBoard', 'board')
        .leftJoinAndSelect('reportedUser.reportedUser', 'user')
        .leftJoinAndSelect('reportedBoard.reportUser', 'boardReportUser')
        .leftJoinAndSelect('reportedUser.reportUser', 'userReportUser')
        .getMany();

      return checkedReport;
    } catch (e) {
      throw new InternalServerErrorException(
        `${e} ### 체크박스 전체 조회 : 알 수 없는 서버 에러입니다.`,
      );
    }
  }

  async selectCheckConfirm(checks: Array<number>) {
    const checkInfo = {
      first: await this.createQueryBuilder('report_checkboxes')
        .select()
        .where('report_checkboxes.no = :no', { no: checks[0] })
        .getOne(),
      second: await this.createQueryBuilder('report_checkboxes')
        .select()
        .where('report_checkboxes.no = :no', { no: checks[1] })
        .getOne(),
      third: await this.createQueryBuilder('report_checkboxes')
        .select()
        .where('report_checkboxes.no = :no', { no: checks[2] })
        .getOne(),
    };

    return checkInfo;
  }

  async saveChecks(check, newReport, relationName) {
    try {
      const { first, second, third } = check;
      const saveCheck = {
        firstCheck: await this.findOne(first.no, {
          relations: [relationName],
        }),
        secondCheck: await this.findOne(second.no, {
          relations: [relationName],
        }),
        thirdCheck: await this.findOne(third.no, {
          relations: [relationName],
        }),
      };
      const { firstCheck, secondCheck, thirdCheck } = saveCheck;

      firstCheck[relationName].push(newReport);
      secondCheck[relationName].push(newReport);
      thirdCheck[relationName].push(newReport);

      this.save(firstCheck);
      this.save(secondCheck);
      this.save(thirdCheck);
    } catch (e) {
      console.log(e.message);
    }
  }
}
