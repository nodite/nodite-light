import { createClient } from 'redis';

export type RedisClient = ReturnType<typeof createClient>;

export interface RedisStoreOptions {
  url: string;
  username?: string;
  password?: string;
}
