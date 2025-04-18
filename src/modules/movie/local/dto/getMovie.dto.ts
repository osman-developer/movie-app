import { AutoMap } from '@automapper/classes';

export class GetMovieDto {
  @AutoMap()
  id: number;

  @AutoMap()
  externalId: number;

  @AutoMap()
  title?: string;

  @AutoMap()
  original_title?: string;

  @AutoMap()
  overview?: string;

  @AutoMap()
  poster_path?: string;

  @AutoMap()
  backdrop_path?: string;

  @AutoMap()
  adult?: boolean;

  @AutoMap()
  original_language?: string;

  @AutoMap()
  popularity?: number;

  averageRating?: number = 0;

  @AutoMap()
  release_date?: string;

  genre_ids?: number[];
}
