import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { UserRepository } from 'src/auth/repository/user.repository';
import { BoardRepository } from 'src/boards/repository/board.repository';
import { ErrorConfirm } from 'src/common/utils/error';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { BoardReportChecksRepository } from '../report-checks/repository/board-report-checks.repository';
import { ReportedUserRepository } from './repository/reported-user.repository';
import { ReportedBoardRepository } from './repository/reported-board.repository';
import { ReportCheckboxRepository } from 'src/report-checkboxes/repository/report-checkbox.repository';
import { ReportChecksModule } from 'src/report-checks/report-checks.module';
import { ReportCheckboxesModule } from 'src/report-checkboxes/report-checkboxes.module';
import { UserReportChecksRepository } from 'src/report-checks/repository/user-report-checks.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ReportedBoardRepository,
      ReportedUserRepository,
      ReportCheckboxRepository,
      BoardRepository,
      UserRepository,
      BoardReportChecksRepository,
      UserReportChecksRepository,
    ]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    AuthModule,
    ReportChecksModule,
    ReportCheckboxesModule,
  ],
  controllers: [ReportsController],
  providers: [ReportsService, ErrorConfirm],
})
export class ReportsModule {}
