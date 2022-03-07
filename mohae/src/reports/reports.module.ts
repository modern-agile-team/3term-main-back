import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { ReportedBoardRepository } from './repository/report-board.repository';
import { ReportedUserRepository } from './repository/report-user.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([ReportedBoardRepository]),
    TypeOrmModule.forFeature([ReportedUserRepository]),
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
