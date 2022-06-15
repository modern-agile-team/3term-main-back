import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
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
import { ReportedBoard } from './entity/reported-board.entity';
import { ReportedUser } from './entity/reported-user.entity';
import { UserReportChecksRepository } from 'src/report-checks/repository/user-report-checks.repository';
import { Connection, QueryRunner } from 'typeorm';
import { ReportedUserRepository } from './repository/reported-user.repository';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(ReportedBoardRepository)
    private reportedBoardRepository: ReportedBoardRepository,

    private reportedUserRepository: ReportedUserRepository,
    private reportCheckboxRepository: ReportCheckboxRepository,
    private boardRepository: BoardRepository,
    private userRepository: UserRepository,

    private connection: Connection,
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

  async createReport(
    reporter: User,
    createReportDto: CreateReportDto,
  ): Promise<void> {
    const { head, checks }: CreateReportDto = createReportDto;
    const uniqueChecks: Array<number> = checks.filter(
      (checkNo: number, index: number) => checks.indexOf(checkNo) === index,
    );
    const infoToChecks: Promise<ReportCheckbox>[] = uniqueChecks.map(
      (checkNo: number) => {
        return this.reportCheckboxRepository.selectCheckConfirm(checkNo);
      },
    );
    const saveReport: object = {
      board: () =>
        this.createBoardReport(createReportDto, infoToChecks, reporter),
      user: () =>
        this.createUserReport(createReportDto, infoToChecks, reporter),
    };
    const catchedError: HttpException = await saveReport[head]();

    if (catchedError) {
      throw catchedError;
    }
  }

  async createBoardReport(
    { headNo, description }: CreateReportDto,
    infoToChecks: Promise<ReportCheckbox>[],
    reporter: User,
  ): Promise<void> {
    const queryRunner: QueryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const board: Board = await this.boardRepository.findOne(headNo, {
        select: ['no'],
        relations: ['reports'],
      });

      this.errorConfirm.notFoundError(
        board,
        '신고하려는 게시글이 존재하지 않습니다.',
      );

      const createBoardReportResult: any = await queryRunner.manager
        .getCustomRepository(ReportedBoardRepository)
        .createBoardReport(reporter, board, description);

      this.errorConfirm.badGatewayError(
        createBoardReportResult.affectedRows,
        '게시글 신고 저장 실패',
      );

      infoToChecks.forEach(async (checkNo: Promise<ReportCheckbox>) => {
        const saveResult: boolean = await queryRunner.manager
          .getCustomRepository(BoardReportChecksRepository)
          .saveBoardReportChecks(
            createBoardReportResult.insertId,
            await checkNo,
          );

        this.errorConfirm.badGatewayError(
          saveResult,
          '게시글 신고 : 체크된 신고 내용 저장 실패',
        );
      });

      board.reports.push(createBoardReportResult.insertId);

      // 릴레이션 추가로 바꿔야 함
      // await queryRunner.manager
      //   .getCustomRepository(BoardRepository)
      //   .save(board);
      await queryRunner.manager
        .getCustomRepository(UserRepository)
        .userRelation(
          reporter,
          createBoardReportResult.insertId,
          'boardReport',
        );
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      return err;
    } finally {
      await queryRunner.release();
    }
  }

  async createUserReport(
    { headNo, description }: CreateReportDto,
    infoToChecks: Promise<ReportCheckbox>[],
    reporter: User,
  ): Promise<void> {
    const queryRunner: any = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user: User = await this.userRepository.findOne(headNo, {
        select: ['no'],
        relations: ['reports'],
      });

      this.errorConfirm.notFoundError(
        user,
        '신고하려는 유저가 존재하지 않습니다.',
      );

      const createUserReportResult: any = await queryRunner.manager
        .getCustomRepository(ReportedUserRepository)
        .createUserReport(reporter, user, description);

      this.errorConfirm.badGatewayError(
        createUserReportResult.affectedRows,
        '유저 신고 저장 실패',
      );

      infoToChecks.forEach(async (checkNo) => {
        const saveResult: Promise<boolean> = await queryRunner.manager
          .getCustomRepository(UserReportChecksRepository)
          .saveUserReportChecks(createUserReportResult.insertId, await checkNo);

        this.errorConfirm.badGatewayError(
          saveResult,
          '유저 신고 : 체크된 신고 내용 저장 실패',
        );
      });

      await queryRunner.manager
        .getCustomRepository(UserRepository)
        .userRelation(user.no, createUserReportResult.insertId, 'reports');
      await queryRunner.manager
        .getCustomRepository(UserRepository)
        .userRelation(reporter, createUserReportResult.insertId, 'userReport');
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      return err;
    } finally {
      await queryRunner.release();
    }
  }
}
