import { redisClient } from '@core/databases/redis';
import Promise from 'bluebird';
import jwt from 'jsonwebtoken';
import JWTR from 'jwt-redis';
import lodash from 'lodash';

lodash.set(jwt, 'destroy', () => 'stateless');

export const jwtAsync = Promise.promisifyAll(
  redisClient
    ? new JWTR(redisClient as never, {
        prefix: 'jwt:token:',
      })
    : (jwt as typeof jwt & { destroy: () => 'stateless' }),
);

export type JwtDestroyType = boolean | 'stateless';

export default jwtAsync;
