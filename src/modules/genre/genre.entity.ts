import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('genres')
export class Genre {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ unique: true }) // Ensuring it's unique to avoid duplicates
  externalId: number; // ID from the external API (e.g., TMDB)
}
