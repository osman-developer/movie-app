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
  async getAverageRatings(externalMovieIds: number[]): Promise<any> {
    if (!externalMovieIds.length) return [];

    const ratings = await this.getRatings(externalMovieIds);

    const response = this.computeAverageRatings(ratings, externalMovieIds);
    return response || [];
  }

  private async getRatings(externalMovieIds: number[]) {
    // Step 1: Fetch all movies with externalIds in externalMovieIds
    const movies = await this.movieRepository.find({
      where: externalMovieIds.map((id) => ({ externalId: id })),
    });

    //Step 2: mapping only the externalMovieIds that exist
    const mappedExternalMoviesIds = movies.map((m) => m.externalId);

    if (!mappedExternalMoviesIds.length) return [];

    // Step 3: Fetch all ratings where externalMovieId is in mappedExternalMoviesIds
    const ratings = await this.ratingRepository.find({
      where: mappedExternalMoviesIds.map((id) => ({ externalMovieId: id })),
    });

    return ratings || [];
  }

  private computeAverageRatings(
    ratings: Rating[],
    movieIds: number[],
  ): Record<number, number> {
    const ratingMap: {} = {};

    //make array like that ar[externalMovieId] to make it easily accessible
    for (const rating of ratings) {
      const id = rating.externalMovieId;
      if (!ratingMap[id]) ratingMap[id] = [];
      ratingMap[id].push(Number(rating.value));
    }

    const result: {} = {};

    for (const id of movieIds) {
      const values = ratingMap[id] || [];
      const average =
        values.length > 0
          ? parseFloat(
              (values.reduce((acc, v) => acc + v, 0) / values.length).toFixed(
                2,
              ),
            )
          : 0;

      result[id] = average;
    }

    return result;
  }
}
