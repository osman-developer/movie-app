import { Module } from '@nestjs/common';
import { RedisCacheService } from './redis-cache.service';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    CacheModule.register({
      store: 'ioredis',
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
    }),
  ],
  providers: [RedisCacheService],
  exports: [RedisCacheService],
})
export class RedisCacheModule {}
