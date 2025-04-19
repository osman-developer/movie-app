import { Injectable, NotFoundException } from '@nestjs/common';
import { Watchlist } from './watchlist.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { Movie } from '../movie/movie.entity';

@Injectable()
export class WatchlistService {
  constructor(
    @InjectRepository(Watchlist)
    private readonly watchlistRepo: Repository<Watchlist>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Movie)
    private readonly movieRepo: Repository<Movie>,
  ) {}

  //Adds movie to watchlist if movie isn't already in watchlist
  async addToWatchlist(userId: number, externalMovieId: number): Promise<void> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    const movie = await this.movieRepo.findOne({
      where: { externalId: externalMovieId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found.`);
    }

    if (!movie) {
      throw new NotFoundException(
        `Movie with external ID ${externalMovieId} not found.`,
      );
    }

    const existing = await this.watchlistRepo.findOne({
      where: { user: { id: userId }, movie: { externalId: externalMovieId } },
    });

    // not in watchlist
    if (!existing) {
      const relation = this.watchlistRepo.create({ user, movie });
      await this.watchlistRepo.save(relation);
    }
  }

  async removeFromWatchlist(
    userId: number,
    externalMovieId: number,
  ): Promise<void> {
    const relation = await this.watchlistRepo.findOne({
      where: { user: { id: userId }, movie: { externalId: externalMovieId } },
      relations: ['user', 'movie'],
    });

    if (relation) {
      await this.watchlistRepo.remove(relation);
    }
  }

  //returns the watchlist for the user
  async getWatchlistForUser(userId: number): Promise<Watchlist[]> {
    const user = await this.userRepo.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return await this.watchlistRepo.find({
      where: { userId },
      relations: ['movie'],
    });
  }
}
