import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BoardRepository } from 'src/boards/repository/board.repository';
import { CreateReportDto } from './dto/create-report.dto';
import {
  ReportCheckBox,
  ReportedBoard,
  ReportedUser,
} from './entity/report.entity';
import {
  ReportCheckBoxRepository,
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

    @InjectRepository(ReportCheckBoxRepository)
    private reportCheckBoxRepository: ReportCheckBoxRepository,

    private boardsRepository: BoardRepository,
  ) {}

  async findOneReportBoard(no: number): Promise<ReportedBoard> {
    const report = await this.reportedBoardRepository.findOneReportBoard(no);

    return report;
  }

  async findOneReportUser(no: number): Promise<void> {
    return await this.reportedUserRepository.findOneReportUser(no);
  }

  async createBoardReport(no: number, createReportDto: CreateReportDto) {
    const board = await this.boardsRepository.findOne(no, {
      relations: ['reports'],
    });
    const { firstNo, secondNo, thirdNo } = createReportDto;

    if (!board) {
      throw new NotFoundException(`No: ${no} 게시글이 존재하지 않습니다.`);
    } else {
      const checks = await this.reportCheckBoxRepository.selectCheckConfirm(
        firstNo,
        secondNo,
        thirdNo,
      );

      const reportedBoard =
        await this.reportedBoardRepository.createBoardReport(
          checks,
          createReportDto,
        );

      board.reports.push(reportedBoard);

      const selectedBoard = await this.boardsRepository.findOne(no);

      await this.boardsRepository.save(board);
      await this.reportCheckBoxRepository.saveChecks(
        firstNo,
        secondNo,
        thirdNo,
        selectedBoard,
      );

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

  async findAllCheckbox(): Promise<ReportCheckBox[]> {
    const checkedReport = await this.reportCheckBoxRepository.findAllCheckbox();

    return checkedReport;
  }
}
