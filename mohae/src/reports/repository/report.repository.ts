import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { CreateReportDto } from '../dto/create-report.dto';
import { ReportedBoard, ReportedUser } from '../entity/report.entity';

@EntityRepository(ReportedBoard)
export class ReportedBoardRepository extends Repository<ReportedBoard> {
  async createBoardReport(no: number, createReportDto: CreateReportDto) {
    const { reportUserNo, firstNo, secondNo, thirdNo, description } =
      createReportDto;

    try {
      const reportedBoard = this.create({
        reportUser: reportUserNo,
        first_no: firstNo,
        second_no: secondNo,
        third_no: thirdNo,
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
  async createUserReport(createReportDto: CreateReportDto) {
    const { reportUserNo, firstNo, secondNo, thirdNo, description } =
      createReportDto;
    const reportedUser = this.create({
      reportUser: reportUserNo,
      first_no: firstNo,
      second_no: secondNo,
      third_no: thirdNo,
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
