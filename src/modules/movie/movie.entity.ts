import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../user/user.entity';
import { Rating } from '../rating/rating.entity';
import { Genre } from '../genre/genre.entity';
import { AutoMap } from '@automapper/classes';

@Entity('movies')
export class Movie {
  @AutoMap()
  @PrimaryGeneratedColumn()
  @ApiProperty({
    example: 391027,
    description: 'Unique identifier assigned to each movie',
  })
  id: number;

  @ManyToMany(() => Genre, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinTable({
    name: 'movie_genre_relation',
    joinColumn: { name: 'movieExternalId', referencedColumnName: 'externalId' },
    inverseJoinColumn: {
      name: 'genreExternalId',
      referencedColumnName: 'externalId',
    },
  })
  genres: Genre[];

  @ManyToMany(() => User, (user) => user.watchlist)
  watchlist: User[];

  @OneToMany(() => Rating, (rating) => rating.movie)
  ratings: Rating[];

  @AutoMap()
  @Column({ type: 'varchar', length: 255, nullable: true })
  @ApiProperty({
    example: 'Echoes of Tomorrow',
    description: 'Main title of the film as it appears in listings',
  })
  title: string;

  @AutoMap()
  @Column({ type: 'varchar', length: 255, nullable: true })
  @ApiProperty({
    example: 'Echoes of Tomorrow',
    description: 'Original production title before translation or change',
  })
  original_title: string;

  @AutoMap()
  @Column({ type: 'text', nullable: true })
  @ApiProperty({
    example:
      'In a world fractured by time, a lone traveler must mend the past to save the future.',
    description: 'Detailed summary of the movie’s storyline',
    nullable: true,
  })
  overview?: string;

  @AutoMap()
  @Column({ type: 'varchar', length: 255, nullable: true })
  @ApiProperty({
    example: '/images/posters/echoes.jpg',
    description: 'Path to the movie’s main promotional poster',
    nullable: true,
  })
  poster_path?: string;

  @AutoMap()
  @Column({ type: 'varchar', length: 255, nullable: true })
  @ApiProperty({
    example: '/images/backdrops/echoes_bg.jpg',
    description: 'Path to the movie’s large background image',
    nullable: true,
  })
  backdrop_path?: string;

  @AutoMap()
  @Column({ type: 'boolean', default: false, nullable: true })
  @ApiProperty({
    example: false,
    description: 'Indicates if the content is intended for mature audiences',
  })
  adult: boolean;

  @AutoMap()
  @Column({ type: 'varchar', length: 10, nullable: true })
  @ApiProperty({
    example: 'en',
    description: 'Language code representing the original spoken language',
  })
  original_language: string;

  @AutoMap()
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 6,
    default: 0,
    nullable: true,
  })
  @ApiProperty({
    example: 546.235789,
    description: 'Popularity metric based on user activity and views',
  })
  popularity: number;

  @AutoMap()
  @Column({ type: 'date', nullable: true })
  @ApiProperty({
    example: '2025-08-15',
    description: 'The scheduled or actual date the movie was released',
    nullable: true,
  })
  release_date?: string;

  @AutoMap()
  @CreateDateColumn({ nullable: true })
  @ApiProperty({
    example: '2025-03-01T12:00:00.000Z',
    description: 'Date and time when this movie record was added',
  })
  createdAt: Date;

  @AutoMap()
  @UpdateDateColumn({ nullable: true })
  @ApiProperty({
    example: '2025-03-10T08:45:30.000Z',
    description: 'Timestamp marking the most recent update of this record',
  })
  updatedAt: Date;

  genre_ids?: number[];

  @AutoMap()
  @Column({ unique: true }) // Ensuring it's unique to avoid duplicates
  externalId: number; // ID from the external API (e.g., TMDB)
}
