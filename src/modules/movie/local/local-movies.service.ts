import { Inject, Injectable } from '@nestjs/common';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Movie } from '../movie.entity';
import { GetMovieDto } from './dto/getMovie.dto';
import { NotFoundException } from '@nestjs/common';
import { RatingsService } from 'src/modules/rating/rating.service';
import { QueryParamsDto } from 'src/common/dtos/query-params.dto';
import { PaginatedResponse } from 'src/common/interfaces/local/paginated-response';
import { BaseQueryHelper } from 'src/common/helpers/base-query-helper';
import { CacheService } from 'src/common/cache/cache.service';

@Injectable()
export class LocalMoviesService {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
    private readonly ratingsService: RatingsService,
    @InjectMapper() private readonly mapper: Mapper,
    private readonly cacheService: CacheService,
  ) {}

  async getMovieById(movieId: number): Promise<GetMovieDto> {
    // Try to get from cache
    const cacheKey = `getMovieById:${movieId}`;
    const cached = await this.cacheService.get<GetMovieDto>(cacheKey);

    if (cached) return cached;
    // No cache, fetch from DB
    const movie = await this.movieRepository.findOne({
      where: { externalId: movieId },
      relations: ['genres'],
    });

    if (!movie) {
      throw new NotFoundException(`Movie not found`);
    }

    // Map the movie entity to a GetMovieDto
    const getMovieDto = this.mapper.map(movie, Movie, GetMovieDto);
    const avgRating = await this.ratingsService.getAverageRatings([
      movie.externalId,
    ]);

    getMovieDto['averageRating'] = avgRating[movie.externalId] ?? 0;

    // Save to cache (TTL = 300s = 5 minutes)
    await this.cacheService.set(cacheKey, getMovieDto, 300);

    return getMovieDto;
  }

  async getMovies(
    query: QueryParamsDto,
  ): Promise<PaginatedResponse<GetMovieDto>> {
    const { page, pageSize, searchTerm, filters } = query;

    // Try to get from cache
    const cacheKey = `movies:${page}-${pageSize}:${searchTerm || ''}:${filters
      .map((f) => `${f.field}:${f.value}`)
      .join(',')}`;

    const cached =
      await this.cacheService.get<PaginatedResponse<GetMovieDto>>(cacheKey);
    if (cached) return cached;
    // No cache, fetch from DB
    const qb = this.movieRepository
      .createQueryBuilder('movie')
      .leftJoinAndSelect('movie.genres', 'genre');

    //Build dynamic query (search,filter,pagination..)
    BaseQueryHelper.apply(qb, {
      search: searchTerm
        ? { term: searchTerm, fields: ['movie.title', 'movie.original_title'] }
        : undefined,
      filters,
      pagination: { page, pageSize },
    });

    const [movies, total] = await qb.getManyAndCount();

    //get the average ratings for all movies
    const mappedExternalMoviesIds = movies.map((m) => m.externalId);
    const moviesRating = await this.ratingsService.getAverageRatings(
      mappedExternalMoviesIds,
    );

    const movieDtos = movies.map((movie) => {
      const dto = this.mapper.map(movie, Movie, GetMovieDto);
      dto.averageRating = moviesRating[movie.externalId] ?? 0;
      return dto;
    });

    const response: PaginatedResponse<GetMovieDto> = {
      page,
      results: movieDtos,
      total_pages: Math.ceil(total / pageSize),
      total_results: total,
    };

    // Save to cache (TTL = 300s = 5 minutes)
    await this.cacheService.set(cacheKey, response, 300);

    return response;
  }
}
