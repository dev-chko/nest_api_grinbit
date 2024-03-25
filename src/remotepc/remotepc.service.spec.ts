import { Test, TestingModule } from '@nestjs/testing';
import { RemotePCService } from './remotepc.service';

describe('RemotePCService', () => {
  let service: RemotePCService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RemotePCService],
    }).compile();

    service = module.get<RemotePCService>(RemotePCService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
