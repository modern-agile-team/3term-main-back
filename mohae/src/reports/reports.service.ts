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

  createBoardReport(
    createReportBoardDto: CreateReportBoardDto,
  ): Promise<ReportedBoard> {
    return this.reportedBoardRepository.createBoardReport(createReportBoardDto);
  }

  createUserReport(
    createReportUserDto: CreateReportUserDto,
  ): Promise<ReportedUser> {
    return this.reportedUserRepository.createUserReport(createReportUserDto);
  }
}
