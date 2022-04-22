import { Test, TestingModule } from '@nestjs/testing';
import { LettersController } from './letters.controller';

describe('LettersController', () => {
  let controller: LettersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LettersController],
    }).compile();

    controller = module.get<LettersController>(LettersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
