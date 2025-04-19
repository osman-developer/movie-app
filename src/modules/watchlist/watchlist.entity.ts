import { Entity, PrimaryColumn, ManyToOne, JoinColumn, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../user/user.entity';
import { Movie } from '../movie/movie.entity';

@Entity('user_watchlist_relation')
export class Watchlist {
  @PrimaryColumn()
  @ApiProperty({ description: 'User ID' })
  userId: number;

  @PrimaryColumn()
  @ApiProperty({ description: 'External Movie ID' })
  externalMovieId: number;

  @ManyToOne(() => User, (user) => user.watchlist, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Movie, (movie) => movie.watchlist, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'externalMovieId', referencedColumnName: 'externalId' })
  movie: Movie;
}
