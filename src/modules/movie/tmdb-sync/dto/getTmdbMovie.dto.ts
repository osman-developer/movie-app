export class GetTmdbMovieDto {
  id: number;
  title: string;
  original_title: string;
  overview?: string;
  poster_path?: string;
  backdrop_path?: string;
  adult: boolean;
  original_language: string;
  popularity: number;
  release_date?: string;
  genre_ids: number[];
  video: boolean;
  vote_average: number;
  vote_count: number;
}
