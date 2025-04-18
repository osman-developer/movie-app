import { Inject, Injectable, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisCacheService {
  private readonly logger = new Logger(RedisCacheService.name);

  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  async set<T>(key: string, value: T, ttlInSeconds: number): Promise<void> {
    try {
      const serializedValue = JSON.stringify(value);
      await this.cacheManager.set(key, serializedValue, ttlInSeconds * 1000);
    } catch (error) {
      this.logger.error(`Error setting cache for key "${key}":`, error);
    }
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const result = await this.cacheManager.get<string>(key);
      return result ? (JSON.parse(result) as T) : null;
    } catch (error) {
      this.logger.error(`Error getting cache for key "${key}":`, error);
      return null;
    }
  }

  async del(key: string): Promise<void> {
    try {
      await this.cacheManager.del(key);
    } catch (error) {
      this.logger.error(`Error deleting cache for key "${key}":`, error);
    }
  }
}
