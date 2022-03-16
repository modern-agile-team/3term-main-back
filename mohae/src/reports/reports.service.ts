import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BoardRepository } from 'src/boards/repository/board.repository';
import { CreateReportDto } from './dto/create-report.dto';
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

    private boardsRepository: BoardRepository,
  ) {}

  async findOneBoard(no: number): Promise<ReportedBoard> {
    return await this.reportedBoardRepository.findOne(no);
  }

  async findOneUser(no: number): Promise<ReportedUser> {
    return await this.reportedUserRepository.findOne(no);
  }

  async createBoardReport(no: number, createReportDto: CreateReportDto) {
    const board = await this.boardsRepository.findOne(no, {
      relations: ['reports'],
    });
    if (!board) {
      throw new NotFoundException(`No: ${no} 게시글이 존재하지 않습니다.`);
    } else {
      const reportedBoard =
        await this.reportedBoardRepository.createBoardReport(
          no,
          createReportDto,
        );

      board.reports.push(reportedBoard);

      await this.boardsRepository.save(board);
      return board;
    }
  }

  async createUserReport(createReportDto: CreateReportDto) {
    const report = await this.reportedUserRepository.createUserReport(
      createReportDto,
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
