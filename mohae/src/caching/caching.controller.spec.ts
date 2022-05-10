import { Test, TestingModule } from '@nestjs/testing';
import { CachingController } from './caching.controller';

describe('CachingController', () => {
  let controller: CachingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CachingController],
    }).compile();

    controller = module.get<CachingController>(CachingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
