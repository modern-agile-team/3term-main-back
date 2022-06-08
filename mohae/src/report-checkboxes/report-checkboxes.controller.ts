import { Controller, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { SuccesseInterceptor } from 'src/common/interceptors/success.interceptor';
import { ReportCheckboxesService } from './report-checkboxes.service';

@UseInterceptors(SuccesseInterceptor)
@UseGuards(AuthGuard('jwt'))
@ApiTags('Report-Checkboxes')
@Controller('report-checkboxes')
export class ReportCheckboxesController {
  constructor(
    private readonly reportCheckboxesService: ReportCheckboxesService,
  ) {}
}
