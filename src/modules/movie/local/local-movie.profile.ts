import { createMap, forMember, mapFrom } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { Mapper } from '@automapper/core';
import { Movie } from '../movie.entity';
import { GetMovieDto } from './dto/getMovie.dto';
@Injectable()
export class LocalMovieProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper) => {
      createMap(
        mapper,
        Movie,
        GetMovieDto,
        forMember(
          (dest) => dest.genre_ids,
          mapFrom((src) => src.genres?.map((g) => g.externalId) || []),
        ),
        forMember(
          (dest) => dest.averageRating,
          mapFrom(() => 0),
        ),
      );
    };
  }
}
