import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosResponse } from 'axios';
import { HttpHelper } from 'src/common/helpers/http-helper.service';
import { GetTmdbMovieDto } from './dto/getTmdbMovie.dto';
import { TmdbPaginatedResponse } from 'src/common/interfaces/tmdb/tmbd-paginated-response';
import { GetTmdbGenreDto } from './dto/getTmdbGenre.dto';
import { TmdbSyncDataResponse } from 'src/common/interfaces/tmdb/tmdb-sync-data-response';
import { InjectRepository } from '@nestjs/typeorm';
import { Genre } from 'src/modules/genre/genre.entity';
import { Repository } from 'typeorm';
import { Movie } from '../movie.entity';

@Injectable()
export class TmdbSyncService implements OnModuleInit {
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly maxPageCount: number;

  constructor(
    private readonly httpHelper: HttpHelper,
    private readonly configService: ConfigService,
    @InjectRepository(Genre)
    private readonly genreRepo: Repository<Genre>,

    @InjectRepository(Movie)
    private readonly movieRepo: Repository<Movie>,
  ) {
    this.apiKey = this.configService.get<string>('TMDB_API_KEY')!;
    this.baseUrl = this.configService.get<string>('TMDB_BASE_URL')!;
    this.maxPageCount = this.configService.get<number>('TMDB_MAX_PAGE_COUNT')!;
  }

  // It will automatically call the function and fills the local db with data
  async onModuleInit() {
    this.syncAndCreateData();
  }

  async syncAndCreateData(): Promise<void> {
    const { genres = [], movies = [] } = await this.syncAllData();

    // Handle genre-related operations
    const createdGenreCount = await this.createGenres(genres);

    // Handle movie-related operations
    const createdMovieCount = await this.createMovies(movies);
    Logger.log(
      `TMDB create completed. Saved ${createdGenreCount} genres and ${createdMovieCount} movies.`,
      'TMDBSyncService',
    );
  }

  // Handles creating genres: fetching, filtering, and saving new genres
  private async createGenres(genres: GetTmdbGenreDto[]): Promise<number> {
    // Load existing genres from the DB
    const existingGenres = await this.genreRepo.find();
    const genreIdMap = new Map(existingGenres.map((g) => [g.externalId, g]));

    // Only create genres that don't exist yet
    const newGenres = genres
      .filter((dto) => !genreIdMap.has(dto.id))
      .map((dto) =>
        this.genreRepo.create({ name: dto.name, externalId: dto.id }),
      );

    if (newGenres.length > 0) {
      const saved = await this.genreRepo.save(newGenres);
      return saved.length;
    }
    return 0;
  }

  // Handles creating movies: fetching, filtering, and saving new movies
  private async createMovies(movies: GetTmdbMovieDto[]): Promise<number> {
    // Load existing movies from the DB
    const existingMovies = await this.movieRepo.find({ relations: ['genres'] });
    const movieMap = new Map(existingMovies.map((m) => [m.externalId, m]));

    // Reload all genres to map by externalId after genre sync
    const allGenres = await this.genreRepo.find();
    const genreIdMap = new Map(allGenres.map((g) => [g.externalId, g]));

    // Filter movies that don't exist yet and create them
    const newMovies = movies
      .filter((dto) => !movieMap.has(dto.id))
      .map((dto) =>
        this.movieRepo.create({
          externalId: dto.id,
          title: dto.title,
          original_title: dto.original_title,
          overview: dto.overview,
          poster_path: dto.poster_path,
          backdrop_path: dto.backdrop_path,
          adult: dto.adult,
          original_language: dto.original_language,
          popularity: dto.popularity,
          release_date: dto.release_date,
          genres: dto.genre_ids
            .map((id) => genreIdMap.get(id))
            .filter((g): g is Genre => Boolean(g)),
        }),
      );

    // Save new movies if any
    if (newMovies.length > 0) {
      const savedMovies = await this.movieRepo.save(newMovies);

      // After saving movies, handle movie-genre relations
      await this.createMovieGenreRelations(savedMovies);
      return savedMovies.length;
    }
    return 0;
  }

  // Handles creating movie-genre relation pairs: extracting, filtering, and inserting unique relations
  private async createMovieGenreRelations(savedMovies: any[]): Promise<void> {
    // Create movie-genre relation pairs
    const movieGenrePairs = savedMovies.flatMap((movie) =>
      movie.genres.map((genre) => ({
        movieExternalId: movie.externalId,
        genreExternalId: genre.externalId,
      })),
    );

    // Remove duplicates within the same batch
    const uniquePairs = Array.from(
      new Set(
        movieGenrePairs.map((p) => `${p.movieExternalId}:${p.genreExternalId}`),
      ),
    ).map((key) => {
      const [movieExternalId, genreExternalId] = key.split(':');
      return {
        movieExternalId: Number(movieExternalId),
        genreExternalId: Number(genreExternalId),
      };
    });

    // Insert unique movie-genre relations in bulk
    if (uniquePairs.length > 0) {
      await this.movieRepo
        .createQueryBuilder()
        .insert()
        .into('movie_genre_relation')
        .values(uniquePairs)
        .orIgnore() // Skip existing records without throwing an error
        .execute();
    }
  }

  // Handles the sync of data
  async syncAllData(): Promise<TmdbSyncDataResponse> {
    Logger.log(
      `Starting TMDB data sync (max pages: ${this.maxPageCount})...`,
      'TMDBSyncService',
    );

    const genres = await this.syncGenres();
    const movies = await this.syncMovies();

    Logger.log(
      `TMDB sync completed. Fetched ${genres.length} genres and ${movies.length} movies.`,
      'TMDBSyncService',
    );
    return { movies, genres };
  }

  // Handles sync of genres from the Api and returns them
  async syncGenres(): Promise<GetTmdbGenreDto[]> {
    try {
      // Call the helper's makeRequest function to fetch the genres
      const genreResponse: AxiosResponse = await this.httpHelper.makeRequest(
        this.baseUrl,
        'genre/movie/list',
        'GET', // Explicitly mention the method
        this.apiKey,
      );

      // Check if the request is successful
      if (!this.httpHelper.isValidRequest(genreResponse.status)) {
        Logger.error(
          `Invalid response status for genre request: ${genreResponse.status}, Data: ${JSON.stringify(genreResponse.data)}`,
        );
        // Optionally, throw an error if needed
        throw new Error('Failed to fetch genres from TMDB');
      }

      // Extract and return the genres
      return genreResponse.data.genres || []; // Ensure default to empty array if no genres
    } catch (error) {
      Logger.error(`Error while fetching TMDB genres: ${error.message}`);
      // Return empty array or rethrow error depending on your application's behavior
      return [];
    }
  }

  // Handles sync of movies from the Api and returns them
  async syncMovies(): Promise<GetTmdbMovieDto[]> {
    const moviesList: GetTmdbMovieDto[] = [];

    try {
      for (let page = 1; page <= this.maxPageCount; page++) {
        const response = await this.httpHelper.makeRequest<
          TmdbPaginatedResponse<GetTmdbMovieDto>
        >(
          this.baseUrl,
          `discover/movie`,
          'GET',
          this.apiKey,
          undefined, // no bearer token
          undefined, // no body
          { language: 'en-US', page: page },
        );

        if (!this.httpHelper.isValidRequest(response.status)) {
          Logger.error(
            `Failed to retrieve TMDB movies on page ${page}. Status: ${response.status}, Data: ${JSON.stringify(response.data)}`,
          );
          continue;
        }
        const movies = response.data.results || [];
        moviesList.push(...movies);
      }

      return moviesList;
    } catch (error) {
      Logger.error(`Error while fetching TMDB movies: ${error.message}`);
      return [];
    }
  }
}
