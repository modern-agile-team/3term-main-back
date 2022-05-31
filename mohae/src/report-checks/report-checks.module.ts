import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportChecksService } from './report-checks.service';
import { BoardReportChecksRepository } from './repository/board-report-checks.repository';
import { UserReportChecksRepository } from './repository/user-report-checks.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BoardReportChecksRepository,
      UserReportChecksRepository,
    ]),
  ],
  providers: [ReportChecksService],
  exports: [ReportChecksService],
})
export class ReportChecksModule {}
