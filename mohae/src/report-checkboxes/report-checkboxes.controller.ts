import { Controller, Get } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { ReportCheckbox } from './entity/report-checkboxes.entity';
import { ReportCheckboxesService } from './report-checkboxes.service';

@Controller('report-checkboxes')
export class ReportCheckboxesController {
  constructor(
    private readonly reportCheckboxesService: ReportCheckboxesService,
  ) {}

  @ApiOperation({
    summary: '체크박스 조회',
    description: '체크박스 조회시 체크된 신고들도 함께 불러옴 API',
  })
  @Get()
  async readAllCheckboxes(): Promise<ReportCheckbox[]> {
    const response = await this.reportCheckboxesService.readAllCheckboxes();

    return Object.assign({
      statusCode: 200,
      msg: `체크 항목별 조회되었습니다.`,
      response,
    });
  }
}
