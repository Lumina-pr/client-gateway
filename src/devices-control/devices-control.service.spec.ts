import { Test, TestingModule } from '@nestjs/testing';
import { DevicesControlService } from './devices-control.service';

describe('DevicesControlService', () => {
  let service: DevicesControlService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DevicesControlService],
    }).compile();

    service = module.get<DevicesControlService>(DevicesControlService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
