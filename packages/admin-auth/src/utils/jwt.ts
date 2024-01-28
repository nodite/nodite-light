import { Redis } from '@nodite-light/admin-database';
import Promise from 'bluebird';
import jwt from 'jsonwebtoken';
import JWTR from 'jwt-redis';
import _set from 'lodash/set';

const jwtExt = _set(jwt, 'destroy', () => 'stateless') as typeof jwt & {
  destroy: () => 'stateless';
};

export const jwtAsync = () =>
  Promise.promisifyAll(
    Redis.client
      ? new JWTR(Redis.client as never, {
          prefix: 'jwt:token:',
        })
      : jwtExt,
  );

export default jwtAsync;

// export type JwtDestroyType = Awaited<ReturnType<Awaited<ReturnType<typeof jwtAsync>>['destroy']>>;
export type JwtDestroyType = boolean | 'stateless';
