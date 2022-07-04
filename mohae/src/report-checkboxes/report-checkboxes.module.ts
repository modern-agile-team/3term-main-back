import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportCheckboxesService } from './report-checkboxes.service';
import { ReportCheckboxRepository } from './repository/report-checkbox.repository';
import { ReportCheckboxesController } from './report-checkboxes.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ReportCheckboxRepository])],
  controllers: [ReportCheckboxesController],
  providers: [ReportCheckboxesService],
  exports: [ReportCheckboxesService],
})
export class ReportCheckboxesModule {}
