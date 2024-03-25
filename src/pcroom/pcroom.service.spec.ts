import { Test, TestingModule } from '@nestjs/testing';
import { PcroomService } from './pcroom.service';

describe('PcroomService', () => {
  let service: PcroomService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PcroomService],
    }).compile();

    service = module.get<PcroomService>(PcroomService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
