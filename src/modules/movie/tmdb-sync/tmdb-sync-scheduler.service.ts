import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TmdbSyncService } from './tmdb-sync.service';

@Injectable()
export class TmdbSyncSchedulerService {
  constructor(private readonly tmdbSyncService: TmdbSyncService) {}

  @Cron(CronExpression.EVERY_12_HOURS)
  async handleSync() {
    Logger.log(
      'Running TMDB Scheduler to Sync and create data...',
      'TMDBSyncSchedulerService',
    );
    await this.tmdbSyncService.syncAndCreateData();
  }
}
