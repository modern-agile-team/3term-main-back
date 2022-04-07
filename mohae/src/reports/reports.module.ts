import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { UserRepository } from 'src/auth/repository/user.repository';
import { BoardRepository } from 'src/boards/repository/board.repository';
import { ErrorConfirm } from 'src/utils/error';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import {
  ReportCheckBoxRepository,
  ReportedBoardRepository,
  ReportedUserRepository,
} from './repository/report.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ReportedBoardRepository,
      ReportedUserRepository,
      ReportCheckBoxRepository,
      BoardRepository,
      UserRepository,
    ]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    AuthModule,
  ],
  controllers: [ReportsController],
  providers: [ReportsService, ErrorConfirm],
})
export class ReportsModule {}
