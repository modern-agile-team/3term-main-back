import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateReportBoardDto } from './dto/create-report-board.dto';
import { ReportBoard } from './entity/report.entity';
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
}
