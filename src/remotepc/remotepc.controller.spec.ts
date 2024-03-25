import { Test, TestingModule } from '@nestjs/testing';
import { RemotePCController } from './remotepc.controller';

describe('RemotePCController', () => {
  let controller: RemotePCController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RemotePCController],
    }).compile();

    controller = module.get<RemotePCController>(RemotePCController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
