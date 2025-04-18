import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '../user/rating.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rating } from './rating.entity';
import { Movie } from '../movie/movie.entity';

@Injectable()
export class RatingsService {
  constructor(
    @InjectRepository(Rating)
    private readonly ratingRepository: Repository<Rating>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
  ) {}

  // Get average rating for a movie
  async getAverageRating(movieId: number): Promise<number> {
    const movie = await this.movieRepository.findOne({
      where: { externalId: movieId },
    });
    if (!movie) {
      throw new NotFoundException('Movie not found');
    }

    const ratings = await this.ratingRepository.find({
      where: { externalMovieId: movie.externalId },
    });

    if (!ratings.length) {
      return 0;
    }

    const sum = ratings.reduce((acc, r) => acc + Number(r.value), 0);
    const average = sum / ratings.length;

    return parseFloat(average.toFixed(2));
  }
}
