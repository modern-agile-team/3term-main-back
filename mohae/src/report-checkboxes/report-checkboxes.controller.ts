import {
  Controller,
  Get,
  HttpCode,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SuccesseInterceptor } from 'src/common/interceptors/success.interceptor';
import { ReportCheckbox } from './entity/report-checkboxes.entity';
import { ReportCheckboxesService } from './report-checkboxes.service';

@UseInterceptors(SuccesseInterceptor)
@UseGuards(AuthGuard())
@ApiTags('Report-Checkboxes')
@Controller('report-checkboxes')
export class ReportCheckboxesController {
  constructor(
    private readonly reportCheckboxesService: ReportCheckboxesService,
  ) {}

  @ApiOperation({
    summary: '체크박스 조회',
    description: '체크박스 조회시 체크된 신고들도 함께 불러옴 API',
  })
  @HttpCode(200)
  @Get()
  readAllCheckboxes(): object {
    const response: ReportCheckbox[] =
      this.reportCheckboxesService.readAllCheckboxes();

    return {
      msg: `체크 항목별 조회되었습니다.`,
      response,
    };
  }
}
