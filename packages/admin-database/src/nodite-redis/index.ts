import logger from '@nodite-light/admin-core/lib/utils/logger';
import { createClient } from 'redis';

import { RedisClient, RedisStoreOptions } from '@/nodite-redis/interface';

export class Database {
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

    return Database.client;
  }

  /**
   * Disconnect from the database
   */
  async disconnect(): Promise<void> {
    await Database.client?.disconnect();
  }
}

export default {};
