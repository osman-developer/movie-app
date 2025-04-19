import { Module } from '@nestjs/common';
import { WatchlistService } from './watchlist.service';
import { WatchlistController } from './watchlist.controller';
import { User } from '../user/user.entity';
import { Movie } from '../movie/movie.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Watchlist } from './watchlist.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Movie, User, Watchlist])],

  providers: [WatchlistService],
  controllers: [WatchlistController],
})
export class WatchlistModule {}
