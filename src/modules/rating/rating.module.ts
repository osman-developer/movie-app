import { Module } from '@nestjs/common';
import { RatingsService } from './rating.service';
import { Movie } from '../movie/movie.entity';
import { Rating } from './rating.entity';
import { User } from '../user/rating.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Movie, User, Rating])],
  providers: [RatingsService],
  exports: [RatingsService],
})
export class RatingModule {}
