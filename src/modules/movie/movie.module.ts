import { Module } from '@nestjs/common';
import { LocalModule } from './local/local.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TmdbSyncModule } from './tmdb-sync/tmdb-sync.module';

@Module({
  imports: [ScheduleModule.forRoot(), TmdbSyncModule, LocalModule],
})
export class MovieModule {}
