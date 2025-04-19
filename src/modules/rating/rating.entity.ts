import { Entity, PrimaryColumn, ManyToOne, JoinColumn, Column } from 'typeorm';
import { Movie } from '../movie/movie.entity';
import { User } from '../user/user.entity';

@Entity('user_movie_rating_relation')
export class Rating {
  @PrimaryColumn()
  userId: number;

  @PrimaryColumn()
  externalMovieId: number;

  @ManyToOne(() => User, (user) => user.ratings)
  @JoinColumn({ name: 'userId' })
  user: User;
  
  @ManyToOne(() => Movie, (movie) => movie.ratings)
  @JoinColumn({ name: 'externalMovieId', referencedColumnName: 'externalId' }) // Reference externalId in Movie entity
  movie: Movie;

  @Column('decimal', { precision: 2, scale: 1, nullable: true })
  value: number;
}
