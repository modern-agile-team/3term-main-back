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
        .leftJoinAndSelect('reported_boards.reportedBoard', 'boards')
        .leftJoinAndSelect('reported_boards.first', 'report_chechboxes')
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
    const { first, second, third } = checks;

    try {
      const reportedBoard = this.create({
        first,
        second,
        third,
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
        .leftJoinAndSelect('reported_users.first', 'firstCheck')
        .leftJoinAndSelect('reported_users.second', 'secondCheck')
        .leftJoinAndSelect('reported_users.third', 'thirdCheck')
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
    const { first, second, third } = checks;

    try {
      const reportedUser = this.create({
        first,
        second,
        third,
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
        .leftJoinAndSelect(
          'report_checkboxes.firstCheckedReport',
          'fisrtReport',
        )
        .leftJoinAndSelect(
          'report_checkboxes.secondCheckedReport',
          'secondReport',
        )
        .leftJoinAndSelect(
          'report_checkboxes.thirdCheckedReport',
          'thirdReport',
        )
        .leftJoinAndSelect('fisrtReport.reportedBoard', 'firstCheckBoards')
        .leftJoinAndSelect('secondReport.reportedBoard', 'secondCheckBoards')
        .leftJoinAndSelect('thirdReport.reportedBoard', 'thirdCheckBoards')
        .getMany();

      return checkedReport;
    } catch (e) {
      throw new InternalServerErrorException(
        `${e} ### 체크박스 전체 조회 : 알 수 없는 서버 에러입니다.`,
      );
    }
  }
  async selectCheckConfirm(
    firstCheck: number,
    secondCheck: number,
    thirdCheck: number,
  ) {
    const checks = {
      first: await this.createQueryBuilder('report_checkboxes')
        .select()
        .where('report_checkboxes.no = :no', { no: firstCheck })
        .getOne(),
      second: await this.createQueryBuilder('report_checkboxes')
        .select()
        .where('report_checkboxes.no = :no', { no: secondCheck })
        .getOne(),
      third: await this.createQueryBuilder('report_checkboxes')
        .select()
        .where('report_checkboxes.no = :no', { no: thirdCheck })
        .getOne(),
    };

    return checks;
  }

  async saveChecks(first: number, second: number, third: number, head) {
    const checks = {
      firstCheck: await this.findOne(first, {
        relations: ['firstCheckedReport'],
      }),
      secondCheck: await this.findOne(second, {
        relations: ['secondCheckedReport'],
      }),
      thirdCheck: await this.findOne(third, {
        relations: ['thirdCheckedReport'],
      }),
    };
    const { firstCheck, secondCheck, thirdCheck } = checks;

    firstCheck.firstCheckedReport.push(head);
    secondCheck.secondCheckedReport.push(head);
    thirdCheck.thirdCheckedReport.push(head);

    this.save(firstCheck);
    this.save(secondCheck);
    this.save(thirdCheck);
  }
}
