import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from 'src/auth/repository/user.repository';
import { BoardRepository } from 'src/boards/repository/board.repository';
import { ErrorConfirm } from 'src/utils/error';
import { CreateReportDto } from './dto/report.dto';
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

    private errorConfirm: ErrorConfirm,
  ) {}

  async findAllCheckbox(): Promise<ReportCheckBox[]> {
    const checkedReport = await this.reportCheckBoxRepository.findAllCheckbox();

    return checkedReport;
  }

  async findOneReportedBoard(no: number): Promise<ReportedBoard> {
    try {
      const report = await this.reportedBoardRepository.findOneReportedBoard(
        no,
      );

      this.errorConfirm.notFoundError(
        report,
        '해당 게시글 신고를 찾을 수 없습니다.',
      );

      return report;
    } catch (e) {
      throw e;
    }
  }

  async findOneReportedUser(no: number): Promise<ReportedUser> {
    try {
      const report = await this.reportedUserRepository.findOneReportedUser(no);

      this.errorConfirm.notFoundError(
        report,
        '해당 유저 신고를 찾을 수 없습니다.',
      );

      return report;
    } catch (e) {
      throw e;
    }
  }

  async createReport(createReportDto: CreateReportDto) {
    const { head, headNo, reportUserNo, checks } = createReportDto;
    const checkInfo = await this.reportCheckBoxRepository.selectCheckConfirm(
      checks,
    );
    const checkboxRelation =
      head === 'user' ? 'reportedUsers' : 'reportedBoards';
    try {
      switch (head) {
        // 게시글 신고일 때의 로직
        case 'board':
          try {
            const board = await this.boardRepository.findOne(headNo, {
              relations: ['reports'],
            });
            this.errorConfirm.notFoundError(
              board,
              '해당 게시글이 존재하지 않습니다.',
            );

            const boardReporter = await this.userRepository.findOne(
              reportUserNo,
              { relations: ['boardReport'] },
            );
            this.errorConfirm.notFoundError(
              boardReporter,
              '신고자를 찾을 수 없습니다.',
            );

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
          this.errorConfirm.notFoundError(user, '유저가 존재하지 않습니다.');

          const userReporter = await this.userRepository.findOne(reportUserNo, {
            relations: ['userReport'],
          });

          this.errorConfirm.notFoundError(
            userReporter,
            '신고자를 찾을 수 없습니다.',
          );

          const createdUserReport =
            await this.reportedUserRepository.createUserReport(createReportDto);

          const userReportCheck =
            await this.reportedUserRepository.findOneReportUserRelation(
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
          this.errorConfirm.notFoundError('', '해당 경로를 찾을 수 없습니다.');
      }
    } catch (e) {
      throw e;
    }
  }
}
