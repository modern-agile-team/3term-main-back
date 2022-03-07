import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import {
  ReportedBoardRepository,
  ReportedUserRepository,
} from './repository/report.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([ReportedBoardRepository]),
    TypeOrmModule.forFeature([ReportedUserRepository]),
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
