import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinTable,
  ManyToMany,
  OneToMany,
} from 'typeorm';
import { Movie } from '../movie/movie.entity';
import { Rating } from '../rating/rating.entity';
import { Exclude } from 'class-transformer';
import { Watchlist } from '../watchlist/watchlist.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => Watchlist, (userWatchlist) => userWatchlist.user)
  watchlist: Watchlist[];

  @OneToMany(() => Rating, (rating) => rating.movie)
  ratings: Rating[];

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;
}
