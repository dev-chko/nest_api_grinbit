import { Test, TestingModule } from '@nestjs/testing';
import { PcusageMontlyController } from './pcusage-montly.controller';

describe('PcusageMontlyController', () => {
  let controller: PcusageMontlyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PcusageMontlyController],
    }).compile();

    controller = module.get<PcusageMontlyController>(PcusageMontlyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
