import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReportCheckbox } from 'src/report-checkboxes/entity/report-checkboxes.entity';
import { ReportCheckboxRepository } from 'src/report-checkboxes/repository/report-checkbox.repository';

@Injectable()
export class ReportChecksService {}
