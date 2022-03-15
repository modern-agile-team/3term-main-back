import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import {
  CreateReportBoardDto,
  CreateReportUserDto,
} from '../dto/create-report.dto';
import { ReportedBoard, ReportedUser } from '../entity/report.entity';

@EntityRepository(ReportedBoard)
export class ReportedBoardRepository extends Repository<ReportedBoard> {
  async createBoardReport(createReportBoardDto: CreateReportBoardDto) {
    const {
      reportedBoardNo,
      reportUserNo,
      firstNo,
      secondNo,
      thirdNo,
      description,
    } = createReportBoardDto;

    const reportedBoard = this.create({
      reportedBoard: reportedBoardNo,
      reportUser: reportUserNo,
      first_no: firstNo,
      second_no: secondNo,
      third_no: thirdNo,
      description,
    });

    try {
      await reportedBoard.save();
      return reportedBoard;
    } catch (e) {
      if (e.errno === 1452) {
        throw new NotFoundException(
          `신고 에러 : 해당 게시글이 존재하지 않습니다.`,
        );
      } else {
        throw new InternalServerErrorException(
          `서버 에러 : 게시글 신고 에러입니다.`,
        );
      }
    }
  }
}

@EntityRepository(ReportedUser)
export class ReportedUserRepository extends Repository<ReportedUser> {
  async createUserReport(createReportUserDto: CreateReportUserDto) {
    const {
      reportedUserNo,
      reportUserNo,
      firstNo,
      secondNo,
      thirdNo,
      description,
    } = createReportUserDto;
    const reportedUser = this.create({
      reportedUser: reportedUserNo,
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
