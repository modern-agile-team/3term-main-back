import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from 'src/auth/repository/user.repository';
import { BoardRepository } from 'src/boards/repository/board.repository';
import { In } from 'typeorm';
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

    @InjectRepository(BoardRepository)
    private boardRepository: BoardRepository,

    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {}

  async findAllCheckbox(): Promise<ReportCheckBox[]> {
    const checkedReport = await this.reportCheckBoxRepository.findAllCheckbox();

    return checkedReport;
  }

  async findOneReportBoard(no: number): Promise<ReportedBoard> {
    const report = await this.reportedBoardRepository.findOneReportBoard(no);

    if (!report) {
      throw new NotFoundException(`해당 유저를 찾을 수 없습니다.`);
    }

    return report;
  }

  async findOneReportUser(no: number): Promise<ReportedUser> {
    const report = await this.reportedUserRepository.findOneReportUser(no);

    if (!report) {
      throw new NotFoundException(`해당 유저를 찾을 수 없습니다.`);
    }
    return report;
  }

  async createReport(createReportDto: CreateReportDto) {
    const { head, headNo, reportUserNo, checks } = createReportDto;
    const checkInfo = await this.reportCheckBoxRepository.selectCheckConfirm(
      checks,
    );
    const checkboxRelation =
      head === 'user' ? 'reportedUsers' : 'reportedBoards';

    switch (head) {
      // 게시글 신고일 때의 로직
      case 'board':
        try {
          const board = await this.boardRepository.findOne(headNo, {
            relations: ['reports'],
          });

          if (!board) {
            throw new NotFoundException(
              `No: ${headNo} 게시글이 존재하지 않습니다.`,
            );
          }

          const boardReporter = await this.userRepository.findOne(
            reportUserNo,
            {
              relations: ['boardReport'],
            },
          );

          if (!boardReporter) {
            throw new NotFoundException('신고자를 찾을 수 없습니다.');
          }

          const createdBoardReport =
            await this.reportedBoardRepository.createBoardReport(
              createReportDto,
            );

          const boardReportRelation =
            await this.reportedBoardRepository.findOneBoardReportRelation(
              createdBoardReport.no,
            );

          boardReportRelation.push(checkInfo.first);
          boardReportRelation.push(checkInfo.second);
          boardReportRelation.push(checkInfo.third);
          board.reports.push(createdBoardReport);
          boardReporter.boardReport.push(createdBoardReport);

          await this.boardRepository.save(board);
          await this.userRepository.save(boardReporter);
          await this.reportCheckBoxRepository.saveChecks(
            checkInfo,
            createdBoardReport,
            checkboxRelation,
          );

          return board;
        } catch (e) {
          throw e;
        }

      // 유저 신고일 때의 로직
      case 'user':
        const user = await this.userRepository.findOne(headNo, {
          relations: ['reports'],
        });

        if (!user) {
          throw new NotFoundException(
            `No: ${headNo} 유저가 존재하지 않습니다.`,
          );
        }

        const userReporter = await this.userRepository.findOne(reportUserNo, {
          relations: ['userReport'],
        });

        if (!userReporter) {
          throw new NotFoundException('신고자를 찾을 수 없습니다.');
        }

        const createdUserReport =
          await this.reportedUserRepository.createUserReport(createReportDto);

        const userReportCheck =
          await this.reportedUserRepository.findOneUserReportRelation(
            createdUserReport.no,
          );

        userReportCheck.push(checkInfo.first);
        userReportCheck.push(checkInfo.second);
        userReportCheck.push(checkInfo.third);
        user.reports.push(createdUserReport);
        userReporter.userReport.push(createdUserReport);

        await this.userRepository.save(user);
        await this.userRepository.save(userReporter);
        await this.reportCheckBoxRepository.saveChecks(
          checkInfo,
          createdUserReport,
          checkboxRelation,
        );

        return user;
      default:
        throw new NotFoundException(
          `해당 경로를 찾을 수 없습니다. Head 정보를 확인해 주세요.`,
        );
    }
  }
}
