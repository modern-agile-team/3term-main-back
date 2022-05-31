import { Test, TestingModule } from '@nestjs/testing';
import { ReportCheckboxesController } from './report-checkboxes.controller';

describe('ReportCheckboxesController', () => {
  let controller: ReportCheckboxesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReportCheckboxesController],
    }).compile();

    controller = module.get<ReportCheckboxesController>(ReportCheckboxesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
