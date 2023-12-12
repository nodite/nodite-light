import config from '@config/config';
import Redis from '@core/databases/redis';

new Redis()
  .connect({
    url: config.redisUrl,
    username: config.redisUser || undefined,
    password: config.redisPass || undefined,
  })
  .then(() => {});
