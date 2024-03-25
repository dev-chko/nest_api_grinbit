import { Test, TestingModule } from '@nestjs/testing';
import { PcusageController } from './pcusage.controller';

describe('PcusageController', () => {
  let controller: PcusageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PcusageController],
    }).compile();

    controller = module.get<PcusageController>(PcusageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
