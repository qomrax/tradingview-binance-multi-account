import { Test, TestingModule } from '@nestjs/testing';
import { ClientManagerService } from './client-manager.service';

describe('ClientManagerService', () => {
  let service: ClientManagerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClientManagerService],
    }).compile();

    service = module.get<ClientManagerService>(ClientManagerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
