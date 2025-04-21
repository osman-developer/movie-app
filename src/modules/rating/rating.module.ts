import { Module } from '@nestjs/common';
import { RatingsService } from './rating.service';
import { Movie } from '../movie/movie.entity';
import { Rating } from './rating.entity';
import { User } from '../user/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CachingModule } from 'src/common/cache/cache.module';

@Module({
  imports: [TypeOrmModule.forFeature([Movie, User, Rating]), CachingModule],
  providers: [RatingsService],
  exports: [RatingsService],
})
export class RatingModule {}
