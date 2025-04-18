import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { HttpHelper } from 'src/common/helpers/http-helper.service';
import { TmdbSyncService } from './tmdb-sync.service';
import { TmdbSyncSchedulerService } from './tmdb-sync-scheduler.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movie } from '../movie.entity';
import { Genre } from 'src/modules/genre/genre.entity';

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([Movie, Genre])],
  providers: [TmdbSyncSchedulerService, TmdbSyncService, HttpHelper],
})
export class TmdbSyncModule {}
