import config from '@config/config';
import { AuthorizedRequest } from '@core/interfaces/authorizedRequest';
import AppError from '@core/utils/appError';
import jwtAsync from '@core/utils/jwt';
import { NextFunction, Response } from 'express';
import { unless } from 'express-unless';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import { TokenDestroyedError, TokenInvalidError } from 'jwt-redis';

const authorized = async (
  req: AuthorizedRequest,
  res: Response,
  next: NextFunction,
) => {
  const { authorization } = req.headers as unknown as {
    authorization?: string;
  };

  if (!authorization) {
    return next(
      new AppError(
        httpStatus.UNAUTHORIZED,
        'Missing authorization in request header',
      ),
    );
  }

  if (authorization?.indexOf('Bearer ') === -1) {
    return next(
      new AppError(httpStatus.UNAUTHORIZED, 'Invalid authorization format'),
    );
  }

  const [, token] = (authorization as string).split(' ');

  try {
    const decoded = (await jwtAsync.verify(
      token,
      config.jwtSecret.trim(),
    )) as AuthorizedRequest['user'] & JwtPayload;

    req.user = decoded;
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

authorized.unless = unless;

export default authorized;
