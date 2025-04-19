import { Module } from '@nestjs/common';
import { LocalMoviesService } from './local-movies.service';
import { LocalMovieController } from './local-movie.controller';
import { Movie } from '../movie.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocalMovieProfile } from './local-movie.profile';
import { Rating } from 'src/modules/rating/rating.entity';
import { RatingModule } from 'src/modules/rating/rating.module';
import { RedisCacheModule } from 'src/common/cache/cache.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Movie, Rating]),
    RatingModule,
    RedisCacheModule,
  ],
  providers: [LocalMoviesService, LocalMovieProfile],
  controllers: [LocalMovieController],
})
export class LocalModule {}
