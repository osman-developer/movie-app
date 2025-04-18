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

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToMany(() => Movie, (movie) => movie.watchlist)
  @JoinTable()
  watchlist: Movie[];

  @OneToMany(() => Rating, (rating) => rating.movie)
  ratings: Rating[];

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;
}
