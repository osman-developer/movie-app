import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '../user/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rating } from './rating.entity';
import { Movie } from '../movie/movie.entity';
import { AddRatingDto } from './dto/addRating.dto';
import { CacheService } from 'src/common/cache/cache.service';

@Injectable()
export class RatingsService {
  constructor(
    @InjectRepository(Rating)
    private readonly ratingRepository: Repository<Rating>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
    private readonly cacheService: CacheService,
  ) {}

  async invalidateMovieCache(externalMovieId: number): Promise<void> {
    // Invalidate the cache for this movie (single movie) after adding a new rating
    const movieCacheKey = `getMovieById:${externalMovieId}`;
    await this.cacheService.del(movieCacheKey);

    //we could Track Cache Keys e.g: by movieId so we store dynamic cache keys in sets grouped by movieId
    //so we only delete the caches related to this movie (irrespective of cache that contains paginated, filtered.. data bcz its hard/impossible to track)
    //but now for simplicity we are calling clearCache that clears all cache just to reflect average rating value
    await this.cacheService.clearCache();
  }

  // Add or update rating for a movie
  async addRating(addRatingDto: AddRatingDto): Promise<void> {
    const { userId, externalMovieId, value } = addRatingDto;

    // Fetch the user by userId
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Fetch the movie by externalId (externalMovieId)
    const movie = await this.movieRepository.findOne({
      where: { externalId: externalMovieId },
    });
    if (!movie) {
      throw new NotFoundException('Movie not found');
    }

    // Check if a rating already exists for this user and movie
    const existingRating = await this.ratingRepository.findOne({
      where: {
        userId: userId,
        externalMovieId: externalMovieId,
      },
    });

    if (existingRating) {
      // Update the existing rating if found
      existingRating.value = value;
      await this.ratingRepository.save(existingRating);
      await this.invalidateMovieCache(externalMovieId);

      return;
    }

    // If no existing rating, create a new one
    const newRating = this.ratingRepository.create({
      userId,
      externalMovieId,
      value,
      user,
      movie,
    });

    // Save the new rating to the database
    await this.ratingRepository.save(newRating);
  }

  // Method to remove a rating based on userId and externalMovieId
  async removeRating(userId: number, externalMovieId: number): Promise<void> {
    try {
      const rating = await this.ratingRepository.findOne({
        where: { userId, externalMovieId },
      });

      if (rating) {
        await this.ratingRepository.delete({ userId, externalMovieId });
      }
    } catch (error) {
      throw new Error(`Error removing rating: ${error.message}`);
    }
  }

  // Get average rating for movies
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

  // It computes the avg rate of each movie and returns an array with the value of each movie
  private computeAverageRatings(
    ratings: Rating[],
    movieIds: number[],
  ): Record<number, number> {
    const ratingMap: {} = {};

    //make array like that ar[externalMovieId]=avgRate to make it easily accessible
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
