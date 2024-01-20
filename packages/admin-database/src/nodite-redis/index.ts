import { logger } from '@nodite-light/admin-core';
import cacheManger, { CacheManagerOptions } from '@type-cacheable/core';
import { useAdapter } from '@type-cacheable/redis-adapter';
import { createClient } from 'redis';

import { RedisClient, RedisStoreOptions } from '@/nodite-redis/interface';

// global cache manager options
cacheManger.setOptions(<CacheManagerOptions>{
  excludeContext: false,
  ttlSeconds: 0,
});

/**
 * Redis database
 */
export default class Database {
  static client: RedisClient | null;

  /**
   * Connect to the database
   * @param options
   * @returns
   */
  async connect(options: RedisStoreOptions): Promise<typeof Database.client> {
    try {
      Database.client = createClient({
        ...options,
        socket: {
          reconnectStrategy: (retries) => {
            logger.warn(`Redis reconnecting ${retries}...`);
            return retries < 10 ? Math.min(retries * 50, 500) : false;
          },
        },
      }).on('error', () => {});

      await Database.client.connect();

      logger.info('Redis connected');
    } catch (err) {
      logger.error('Redis connection error, some features are not be available', err);
      Database.client = null;
    }

    // set cache manager adapter
    if (Database.client) {
      cacheManger.setClient(useAdapter(Database.client as never));
      logger.info('Redis cache manager adapter set');
    }

    return Database.client;
  }

  /**
   * Disconnect from the database
   */
  async disconnect(): Promise<void> {
    await Database.client?.disconnect();
  }
}
