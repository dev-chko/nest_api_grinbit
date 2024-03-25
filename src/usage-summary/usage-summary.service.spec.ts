import { Test, TestingModule } from '@nestjs/testing';
import { UsageSummaryService } from './usage-summary.service';

describe('UsageSummaryService', () => {
  let service: UsageSummaryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsageSummaryService],
    }).compile();

    service = module.get<UsageSummaryService>(UsageSummaryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
