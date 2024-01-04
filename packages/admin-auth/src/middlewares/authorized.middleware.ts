import { AppError, config } from '@nodite-light/admin-core';
import { NextFunction, Response } from 'express';
import httpContext from 'express-http-context';
import { unless } from 'express-unless';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import { TokenDestroyedError, TokenInvalidError } from 'jwt-redis';

import { AuthorizedRequest } from '@/interfaces/authorizedRequest';
import casbin from '@/nd-casbin';
import { jwtAsync } from '@/utils/jwt';

/**
 * Permissions decorator.
 * @param perms
 * @returns
 */
export function Permissions(...perms: string[]) {
  return function wrapperFn(target: unknown, propertyKey: string, descriptor: PropertyDescriptor) {
    // original method.
    const original = descriptor.value;

    const newDescriptor = { ...descriptor };

    // new method.
    newDescriptor.value = async function decorator(...args: unknown[]) {
      const user = httpContext.get('user') as AuthorizedRequest['user'];

      // check if user is authorized.
      if (!user) {
        throw new AppError(httpStatus.UNAUTHORIZED, 'Unauthorized');
      }

      const enforcer = await casbin();

      // casbin enforce.
      const promises = perms.map(async (perm) => {
        const [dom, obj, act] = perm.split(':');
        const isValid = await enforcer.enforce(`sys_user:${user.userId}`, dom, obj, act);
        if (!isValid) {
          return Promise.reject(
            new AppError(
              httpStatus.FORBIDDEN,
              `You do not have permission to perform the action ${perm}`,
            ),
          );
        }
        return Promise.resolve();
      });

      await Promise.all(promises);

      return original.apply(this, args);
    };

    // return edited descriptor as opposed to overwriting the descriptor.
    return newDescriptor;
  };
}

/**
 * Authorized middleware.
 * @param req
 * @param res
 * @param next
 * @returns
 */
const authorized = async (req: AuthorizedRequest, res: Response, next: NextFunction) => {
  const { authorization } = req.headers as unknown as {
    authorization?: string;
  };

  if (!authorization) {
    return next(new AppError(httpStatus.UNAUTHORIZED, 'Missing authorization in request header'));
  }

  if (authorization?.indexOf('Bearer ') === -1) {
    return next(new AppError(httpStatus.UNAUTHORIZED, 'Invalid authorization format'));
  }

  const [, token] = (authorization as string).split(' ');

  try {
    const decoded = (await jwtAsync().verify(
      token,
      config.jwtSecret.trim(),
    )) as AuthorizedRequest['user'] & JwtPayload;

    req.user = decoded;
    httpContext.set('user', decoded);
  } catch (err) {
    if (err instanceof TokenInvalidError) {
      err.message = 'Invalid authorization';
    } else if (err instanceof TokenDestroyedError) {
      err.message = 'Authorization expired';
    }

    return next(new AppError(httpStatus.UNAUTHORIZED, (err as Error).message));
  }

  return next();
};

// add unless method to authorized middleware.
authorized.unless = unless;

// export authorized middleware.
export default authorized;
