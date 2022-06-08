import { InternalServerErrorException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { ReportCheckbox } from '../entity/report-checkboxes.entity';

@EntityRepository(ReportCheckbox)
export class ReportCheckboxRepository extends Repository<ReportCheckbox> {
  async selectCheckConfirm(checkNo: number): Promise<ReportCheckbox> {
    try {
      const checkInfo: ReportCheckbox = await this.createQueryBuilder(
        'report_checkboxes',
      )
        .select()
        .where('report_checkboxes.no = :checkNo', { checkNo })
        .getOne();

      return checkInfo;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }
}
