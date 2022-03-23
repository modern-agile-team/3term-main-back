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

    return report;
  }

  async findOneReportUser(no: number): Promise<ReportedUser> {
    return await this.reportedUserRepository.findOneReportUser(no);
  }

  async createReport(createReportDto: CreateReportDto) {
    const { head, headNo, reportUserNo, checks } = createReportDto;
    const checkInfo = await this.reportCheckBoxRepository.selectCheckConfirm(
      checks,
    );

    switch (head) {
      // 게시글 신고일 때의 로직
      case 'board':
        const board = await this.boardRepository.findOne(headNo, {
          relations: ['reports'],
        });

        if (!board) {
          throw new NotFoundException(
            `No: ${headNo} 게시글이 존재하지 않습니다.`,
          );
        }

        const boardReporter = await this.userRepository.findOne(reportUserNo, {
          relations: ['boardReport'],
        });

        if (!boardReporter) {
          throw new NotFoundException('신고자를 찾을 수 없습니다.');
        }

        const reportedBoard =
          await this.reportedBoardRepository.createBoardReport(
            checkInfo,
            createReportDto,
          );

        board.reports.push(reportedBoard);
        boardReporter.boardReport.push(reportedBoard);

        const selectedBoard = await this.boardRepository.findOne(headNo);

        await this.boardRepository.save(board);
        await this.userRepository.save(boardReporter);
        await this.reportCheckBoxRepository.saveChecks(
          checkInfo,
          selectedBoard,
        );

        return board;

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

        // const reportedUser = await this.reportedUserRepository.createUserReport(
        //   checks,
        //   createReportDto,
        // );

        // user.reports.push(reportedUser);
        // userReporter.userReport.push(reportedUser);

        // const selectedUser = await this.userRepository.findOneUser(headNo);

        // await this.userRepository.save(user);
        // await this.userRepository.save(userReporter);
        // await this.reportCheckBoxRepository.saveChecks(
        //   firstNo,
        //   secondNo,
        //   thirdNo,
        //   selectedUser,
        // );

        return user;
      default:
        throw new NotFoundException(
          `해당 경로를 찾을 수 없습니다. Head 정보를 확인해 주세요.`,
        );
    }
  }
}
