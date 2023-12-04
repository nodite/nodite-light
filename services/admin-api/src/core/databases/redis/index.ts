import {
  RedisClient,
  RedisStoreOptions,
} from '@core/databases/redis/interface';
import logger from '@core/utils/logger';
import { createClient } from 'redis';

// eslint-disable-next-line import/no-mutable-exports
let redisClient: RedisClient | null;

export default class Database {
  async connect(options: RedisStoreOptions): Promise<typeof redisClient> {
    try {
      redisClient = createClient({
        ...options,
        socket: {
          reconnectStrategy: (retries) => {
            logger.warn(`Redis reconnecting ${retries}...`);
            return retries < 10 ? Math.min(retries * 50, 500) : false;
          },
        },
      }).on('error', () => {});

      await redisClient.connect();

      logger.info('Redis connected');
    } catch (err) {
      logger.error(
        'Redis connection error, some features are not be available',
        err,
      );
      redisClient = null;
    }

    return redisClient;
  }

  async disconnect(): Promise<void> {
    await redisClient?.disconnect();
  }
}

export { redisClient };
