import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CreateReportBoardDto,
  CreateReportUserDto,
} from './dto/create-report.dto';
import { ReportBoard, ReportUser } from './entity/report.entity';
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

  async findOne(no: number): Promise<ReportBoard> {
    return await this.reportedBoardRepository.findOne(no);
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
