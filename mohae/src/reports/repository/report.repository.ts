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
    const { reportUserNo, description } = createReportDto;
    const { first, second, third } = checks;

    try {
      const reportedBoard = this.create({
        reportUser: reportUserNo,
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
  async findOneReportUser(no: number): Promise<void> {
    return;
  }

  async createUserReport(createReportDto: CreateReportDto) {
    const { reportUserNo, description } = createReportDto;
    const reportedUser = this.create({
      reportUser: reportUserNo,
      // first_no: firstNo,
      // second_no: secondNo,
      // third_no: thirdNo,
      description,
    });

    try {
      await reportedUser.save();
      return reportedUser;
    } catch (e) {
      if (e.errno === 1452) {
        throw new NotFoundException(
          `신고 에러 : 해당 유저가 존재하지 않습니다.`,
        );
      } else {
        throw new InternalServerErrorException(
          `서버 에러 : 유저 신고 에러입니다.`,
        );
      }
    }
  }
}

@EntityRepository(ReportCheckBox)
export class ReportCheckBoxRepository extends Repository<ReportCheckBox> {
  async findAllCheckbox(): Promise<ReportCheckBox[]> {
    const checkedReport = this.createQueryBuilder('report_checkboxes')
      .leftJoinAndSelect('report_checkboxes.firstCheckedReport', 'fisrtReport')
      .leftJoinAndSelect(
        'report_checkboxes.secondCheckedReport',
        'secondReport',
      )
      .leftJoinAndSelect('report_checkboxes.thirdCheckedReport', 'thirdReport')
      .leftJoinAndSelect('fisrtReport.reportedBoard', 'firstCheckBoards')
      .leftJoinAndSelect('secondReport.reportedBoard', 'secondCheckBoards')
      .leftJoinAndSelect('thirdReport.reportedBoard', 'thirdCheckBoards')
      .getMany();

    return checkedReport;
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

  async saveChecks(first, second, third, board) {
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

    firstCheck.firstCheckedReport.push(board);
    secondCheck.secondCheckedReport.push(board);
    thirdCheck.thirdCheckedReport.push(board);

    this.save(firstCheck);
    this.save(secondCheck);
    this.save(thirdCheck);
  }
}
