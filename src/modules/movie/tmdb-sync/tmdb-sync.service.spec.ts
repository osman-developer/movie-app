import { Test, TestingModule } from '@nestjs/testing';
import { TmdbSyncService } from './tmdb-sync.service';

describe('TmdbSyncService', () => {
  let service: TmdbSyncService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TmdbSyncService],
    }).compile();

    service = module.get<TmdbSyncService>(TmdbSyncService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
