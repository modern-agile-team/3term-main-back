import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entity/user.entity';
import { UserRepository } from 'src/auth/repository/user.repository';
import { Board } from 'src/boards/entity/board.entity';
import { BoardRepository } from 'src/boards/repository/board.repository';
import { ErrorConfirm } from 'src/common/utils/error';
import { CreateReportDto } from './dto/create-report.dto';
import { ReportCheckbox } from '../report-checkboxes/entity/report-checkboxes.entity';
import { ReportCheckboxRepository } from '../report-checkboxes/repository/report-checkbox.repository';
import { BoardReportChecksRepository } from '../report-checks/repository/board-report-checks.repository';
import { ReportedBoardRepository } from './repository/reported-board.repository';
import { ReportedUserRepository } from './repository/reported-user.repository';
import { ReportedBoard } from './entity/reported-board.entity';
import { ReportedUser } from './entity/reported-user.entity';
import { UserReportChecksRepository } from 'src/report-checks/repository/user-report-checks.repository';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(ReportedBoardRepository)
    private reportedBoardRepository: ReportedBoardRepository,

    private reportedUserRepository: ReportedUserRepository,
    private reportCheckboxRepository: ReportCheckboxRepository,
    private boardRepository: BoardRepository,
    private userRepository: UserRepository,
    private boardReportChecksRepository: BoardReportChecksRepository,
    private userReportChecksRepository: UserReportChecksRepository,

    private errorConfirm: ErrorConfirm,
  ) {}

  async readOneReportedBoard(boardNo: number): Promise<ReportedBoard> {
    try {
      const reportedBoard: ReportedBoard =
        await this.reportedBoardRepository.readOneReportedBoard(boardNo);

      this.errorConfirm.notFoundError(
        reportedBoard,
        '해당 게시글 신고를 찾을 수 없습니다.',
      );

      return reportedBoard;
    } catch (err) {
      throw err;
    }
  }

  async readOneReportedUser(userNo: number): Promise<ReportedUser> {
    try {
      const reportedUser: ReportedUser =
        await this.reportedUserRepository.readOneReportedUser(userNo);

      this.errorConfirm.notFoundError(
        reportedUser,
        '해당 유저 신고를 찾을 수 없습니다.',
      );

      return reportedUser;
    } catch (err) {
      throw err;
    }
  }

  async createReport(reporter: User, createReportDto: CreateReportDto) {
    const reportUserNo: number = reporter.no;
    const { head, headNo, checks, description }: CreateReportDto =
      createReportDto;
    const uniqueChecks: Array<number> = checks.filter(
      (checkNo: number, index) => {
        return checks.indexOf(checkNo) === index;
      },
    );
    const infoToChecks: Promise<ReportCheckbox>[] = uniqueChecks.map(
      (checkNo: number) => {
        return this.reportCheckboxRepository.selectCheckConfirm(checkNo);
      },
    );

    switch (head) {
      // 게시글 신고일 때의 로직
      case 'board':
        try {
          const board: Board = await this.boardRepository.findOne(headNo, {
            select: ['no'],
            relations: ['reports'],
          });

          this.errorConfirm.notFoundError(
            board,
            '신고하려는 게시글이 존재하지 않습니다.',
          );

          const createBoardReportResult =
            await this.reportedBoardRepository.createBoardReport(description);

          this.errorConfirm.badGatewayError(
            createBoardReportResult.affectedRows,
            '게시글 신고 저장 실패',
          );

          infoToChecks.forEach(async (checkNo: Promise<ReportCheckbox>) => {
            const saveResult: Promise<boolean> =
              this.boardReportChecksRepository.saveBoardReportChecks(
                createBoardReportResult.insertId,
                await checkNo,
              );

            this.errorConfirm.badGatewayError(
              saveResult,
              '게시글 신고 : 체크된 신고 내용 저장 실패',
            );
          });

          board.reports.push(createBoardReportResult.insertId);
          await this.boardRepository.save(board);
          await this.userRepository.userRelation(
            reportUserNo,
            createBoardReportResult.insertId,
            'boardReport',
          );

          break;
        } catch (err) {
          throw err;
        }
      // 유저 신고일 때의 로직
      case 'user':
        try {
          const user: User = await this.userRepository.findOne(headNo, {
            select: ['no'],
            relations: ['reports'],
          });

          this.errorConfirm.notFoundError(
            user,
            '신고하려는 유저가 존재하지 않습니다.',
          );

          const createUserReportResult: any =
            await this.reportedUserRepository.createUserReport(description);

          this.errorConfirm.badGatewayError(
            createUserReportResult.affectedRows,
            '유저 신고 저장 실패',
          );

          infoToChecks.forEach(async (checkNo) => {
            const saveResult: Promise<boolean> =
              await this.userReportChecksRepository.saveUserReportChecks(
                createUserReportResult.insertId,
                await checkNo,
              );

            this.errorConfirm.badGatewayError(
              saveResult,
              '유저 신고 : 체크된 신고 내용 저장 실패',
            );
          });

          await this.userRepository.userRelation(
            user.no,
            createUserReportResult.insertId,
            'reports',
          );
          await this.userRepository.userRelation(
            reportUserNo,
            createUserReportResult.insertId,
            'userReport',
          );

          break;
        } catch (err) {
          throw err;
        }
      default:
        throw new BadRequestException('해당 경로를 찾을 수 없습니다.');
    }
  }
}
