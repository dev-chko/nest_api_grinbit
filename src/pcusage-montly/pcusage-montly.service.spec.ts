import { Test, TestingModule } from '@nestjs/testing';
import { PcusageMontlyService } from './pcusage-montly.service';

describe('PcusageMontlyService', () => {
  let service: PcusageMontlyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PcusageMontlyService],
    }).compile();

    service = module.get<PcusageMontlyService>(PcusageMontlyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
