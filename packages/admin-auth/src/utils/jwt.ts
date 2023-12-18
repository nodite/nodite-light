import { Database as Redis } from '@nodite-light/admin-database/lib/nodite-redis';
import Promise from 'bluebird';
import jwt from 'jsonwebtoken';
import JWTR from 'jwt-redis';
import lodash from 'lodash';

lodash.set(jwt, 'destroy', () => 'stateless');

export const jwtAsync = () =>
  Promise.promisifyAll(
    Redis.client
      ? new JWTR(Redis.client as never, {
          prefix: 'jwt:token:',
        })
      : (jwt as typeof jwt & { destroy: () => 'stateless' }),
  );

export type JwtDestroyType = Awaited<ReturnType<Awaited<ReturnType<typeof jwtAsync>>['destroy']>>;

export default jwtAsync;
