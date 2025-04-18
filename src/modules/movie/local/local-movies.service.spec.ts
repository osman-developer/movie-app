import { Test, TestingModule } from '@nestjs/testing';
import { LocalMoviesService } from './local-movies.service';

describe('LocalMoviesService', () => {
  let service: LocalMoviesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LocalMoviesService],
    }).compile();

    service = module.get<LocalMoviesService>(LocalMoviesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
