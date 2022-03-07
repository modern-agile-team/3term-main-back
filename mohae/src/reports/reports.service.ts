import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateReportBoardDto } from './dto/create-report-board.dto';
import { CreateReportUserDto } from './dto/create-report-user.dto';
import { ReportBoard, ReportUser } from './entity/report.entity';
import { ReportedBoardRepository } from './repository/report-board.repository';
import { ReportedUserRepository } from './repository/report-user.repository';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(ReportedBoardRepository)
    private reportedBoardRepository: ReportedBoardRepository,

    @InjectRepository(ReportedUserRepository)
    private reportedUserRepository: ReportedUserRepository,
  ) {}

  findOne(id: number): Promise<ReportBoard> {
    return this.reportedBoardRepository.findOne(id);
  }

  createBoardReport(
    createReportBoardDto: CreateReportBoardDto,
  ): Promise<ReportBoard> {
    return this.reportedBoardRepository.createBoardReport(createReportBoardDto);
  }

  createUserReport(
    createReportUserDto: CreateReportUserDto,
  ): Promise<ReportUser> {
    return this.reportedUserRepository.createUserReport(createReportUserDto);
  }
}
