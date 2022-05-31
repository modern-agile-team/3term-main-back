import { Test, TestingModule } from '@nestjs/testing';
import { ReportChecksService } from './report-checks.service';

describe('ReportChecksService', () => {
  let service: ReportChecksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReportChecksService],
    }).compile();

    service = module.get<ReportChecksService>(ReportChecksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
