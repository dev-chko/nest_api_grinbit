import { Test, TestingModule } from '@nestjs/testing';
import { PcroomController } from './pcroom.controller';

describe('PcroomController', () => {
  let controller: PcroomController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PcroomController],
    }).compile();

    controller = module.get<PcroomController>(PcroomController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
