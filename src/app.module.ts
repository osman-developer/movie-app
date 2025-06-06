import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import postgresDbConfig from './config/postgres.db.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovieModule } from './modules/movie/movie.module';
import { RatingModule } from './modules/rating/rating.module';
import { UserModule } from './modules/user/user.module';
import { GenreModule } from './modules/genre/genre.module';
import { AutomapperModule } from '@automapper/nestjs';
import { classes } from '@automapper/classes';
import { CachingModule } from './common/cache/cache.module';
import { RatingController } from './modules/rating/rating.controller';
import { WatchlistModule } from './modules/watchlist/watchlist.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV === 'production' ? '.env.docker' : '.env',
      expandVariables: true,
      load: [postgresDbConfig],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: postgresDbConfig,
    }),
    AutomapperModule.forRoot({
      strategyInitializer: classes(),
    }),
    CachingModule,
    MovieModule,
    RatingModule,
    UserModule,
    GenreModule,
    WatchlistModule,
    AuthModule,
  ],
  controllers: [AppController, RatingController],
  providers: [AppService],
})
export class AppModule {}
