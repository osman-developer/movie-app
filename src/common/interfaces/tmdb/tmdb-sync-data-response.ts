import { GetTmdbGenreDto } from 'src/modules/movie/tmdb-sync/dto/getTmdbGenre.dto';
import { GetTmdbMovieDto } from 'src/modules/movie/tmdb-sync/dto/getTmdbMovie.dto';

export interface TmdbSyncDataResponse {
  movies?: GetTmdbMovieDto[];
  genres?: GetTmdbGenreDto[];
}
