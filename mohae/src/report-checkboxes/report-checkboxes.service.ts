import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReportCheckbox } from './entity/report-checkboxes.entity';
import { ReportCheckboxRepository } from './repository/report-checkbox.repository';

@Injectable()
export class ReportCheckboxesService {
  constructor(
    @InjectRepository(ReportCheckboxRepository)
    private readonly reportCheckboxRepository: ReportCheckboxRepository,
  ) {}

  async readAllCheckboxes(): Promise<ReportCheckbox[]> {
    const checkList: ReportCheckbox[] =
      await this.reportCheckboxRepository.readAllCheckboxes();

    return checkList;
  }
}
