import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CreateReportBoardDto,
  CreateReportUserDto,
} from './dto/create-report.dto';
import { ReportedBoard, ReportedUser } from './entity/report.entity';
import {
  ReportedBoardRepository,
  ReportedUserRepository,
} from './repository/report.repository';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(ReportedBoardRepository)
    private reportedBoardRepository: ReportedBoardRepository,

    @InjectRepository(ReportedUserRepository)
    private reportedUserRepository: ReportedUserRepository,
  ) {}

  async findOneBoard(no: number): Promise<ReportedBoard> {
    return await this.reportedBoardRepository.findOne(no);
  }

  async findOneUser(no: number): Promise<ReportedUser> {
    return await this.reportedUserRepository.findOne(no);
  }

  async createBoardReport(createReportBoardDto: CreateReportBoardDto) {
    const report = await this.reportedBoardRepository.createBoardReport(
      createReportBoardDto,
    );

    if (report) {
      return {
        success: true,
        reportNo: report.no,
        status: 201,
        msg: '게시글 신고가 정상적으로 등록되었습니다.',
      };
    } else {
      return {
        success: false,
        status: 500,
        msg: '게시글 신고 에러: 알 수 없는 에러입니다.',
      };
    }
  }

  async createUserReport(createReportUserDto: CreateReportUserDto) {
    const report = await this.reportedUserRepository.createUserReport(
      createReportUserDto,
    );

    if (report) {
      return {
        success: true,
        reportNo: report.no,
        status: 201,
        msg: '유저 신고가 정상적으로 등록되었습니다.',
      };
    } else {
      return {
        success: false,
        status: 500,
        msg: '유저 신고 에러: 알 수 없는 에러입니다.',
      };
    }
  }
}
