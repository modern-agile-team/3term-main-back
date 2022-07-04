import { Controller, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { ReportCheckboxesService } from './report-checkboxes.service';

@UseGuards(AuthGuard('jwt'))
@ApiTags('Report-Checkboxes')
@Controller('report-checkboxes')
export class ReportCheckboxesController {
  constructor(
    private readonly reportCheckboxesService: ReportCheckboxesService,
  ) {}
}
