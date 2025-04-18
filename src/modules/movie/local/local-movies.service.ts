import { Injectable } from '@nestjs/common';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Movie } from '../movie.entity';
import { GetMovieDto } from './dto/getMovie.dto';
import { NotFoundException } from '@nestjs/common';
import { RatingsService } from 'src/modules/rating/rating.service';

@Injectable()
export class LocalMoviesService {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
    private readonly ratingsService: RatingsService,
    @InjectMapper() private readonly mapper: Mapper, // Mapper injection
  ) {}

  async getMovieById(movieId: number): Promise<GetMovieDto> {
    const movie = await this.movieRepository.findOne({
      where: { externalId: movieId },
      relations: ['genres'], // Make sure 'genres' is loaded
    });

    if (!movie) {
      throw new NotFoundException(`Movie not found`);
    }

    // Map the movie entity to a GetMovieDto
    const getMovieDto = this.mapper.map(movie, Movie, GetMovieDto);
    getMovieDto['averageRating'] = await this.ratingsService.getAverageRating(
      movie.externalId,
    );
    return getMovieDto;
  }
}
