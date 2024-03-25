import { Test, TestingModule } from '@nestjs/testing';
import { UsageSummaryController } from './usage-summary.controller';

describe('UsageSummaryController', () => {
  let controller: UsageSummaryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsageSummaryController],
    }).compile();

    controller = module.get<UsageSummaryController>(UsageSummaryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
