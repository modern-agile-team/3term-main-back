import { Test, TestingModule } from '@nestjs/testing';
import { ReportCheckboxesService } from './report-checkboxes.service';

describe('ReportCheckboxesService', () => {
  let service: ReportCheckboxesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReportCheckboxesService],
    }).compile();

    service = module.get<ReportCheckboxesService>(ReportCheckboxesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
