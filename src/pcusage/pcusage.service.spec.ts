import { Test, TestingModule } from '@nestjs/testing';
import { PcusageService } from './pcusage.service';

describe('PcusageService', () => {
  let service: PcusageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PcusageService],
    }).compile();

    service = module.get<PcusageService>(PcusageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
