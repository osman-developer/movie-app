import { Test, TestingModule } from '@nestjs/testing';
import { WatchlistService } from './watchlist.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Watchlist } from './watchlist.entity';
import { User } from '../user/user.entity';
import { Movie } from '../movie/movie.entity';
import { NotFoundException } from '@nestjs/common';

describe('WatchlistService (minimal)', () => {
  let service: WatchlistService;
  const mockWatchlistRepo = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
  };
  const mockUserRepo = { findOne: jest.fn() };
  const mockMovieRepo = { findOne: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WatchlistService,
        { provide: getRepositoryToken(Watchlist), useValue: mockWatchlistRepo },
        { provide: getRepositoryToken(User), useValue: mockUserRepo },
        { provide: getRepositoryToken(Movie), useValue: mockMovieRepo },
      ],
    }).compile();

    service = module.get<WatchlistService>(WatchlistService);
    jest.clearAllMocks();
  });

  it('adds movie to watchlist if not already added', async () => {
    mockUserRepo.findOne.mockResolvedValue({ id: 1 });
    mockMovieRepo.findOne.mockResolvedValue({ externalId: 123 });
    mockWatchlistRepo.findOne.mockResolvedValue(null);

    await service.addToWatchlist(1, 123);

    expect(mockWatchlistRepo.create).toHaveBeenCalled();
    expect(mockWatchlistRepo.save).toHaveBeenCalled();
  });

  it('throws if user not found', async () => {
    mockUserRepo.findOne.mockResolvedValue(null);

    await expect(service.addToWatchlist(1, 123)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('throws if movie not found', async () => {
    mockUserRepo.findOne.mockResolvedValue({ id: 1 });
    mockMovieRepo.findOne.mockResolvedValue(null);

    await expect(service.addToWatchlist(1, 123)).rejects.toThrow(
      NotFoundException,
    );
  });
});
