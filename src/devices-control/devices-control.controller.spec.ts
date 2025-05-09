import { Test, TestingModule } from '@nestjs/testing';
import { DevicesControlController } from './devices-control.controller';
import { DevicesControlService } from './devices-control.service';

describe('DevicesControlController', () => {
  let controller: DevicesControlController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DevicesControlController],
      providers: [DevicesControlService],
    }).compile();

    controller = module.get<DevicesControlController>(DevicesControlController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
