import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  BeforeInsert,
} from 'typeorm';
import { Rating } from '../rating/rating.entity';
import { Exclude } from 'class-transformer';
import { Watchlist } from '../watchlist/watchlist.entity';
import * as bcrypt from 'bcrypt';
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
  name: string;

  @Column()
  @Exclude()
  password: string;

  //A trigger to hash password before inserting user
  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
