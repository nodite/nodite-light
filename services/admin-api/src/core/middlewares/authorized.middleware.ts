import config from '@config/config';
import { AuthorizedRequest } from '@core/interfaces/authorizedRequest';
import AppError from '@core/utils/appError';
import logger from '@core/utils/logger';
import { NextFunction, Response } from 'express';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';

const authorized = (
  req: AuthorizedRequest,
  res: Response,
  next: NextFunction,
) => {
  const { authorization } = req.headers as unknown as {
    authorization?: string;
  };

  const appError = new AppError(
    httpStatus.UNAUTHORIZED,
    'Access forbidden: invalid authorization',
  );

  if (!authorization) {
    logger.error('Missing authorization in request header');
    throw appError;
  }

  if (authorization?.indexOf('Bearer ') === -1) {
    logger.error('Invalid authorization format');
    throw appError;
  }

  const [, token] = (authorization as string).split(' ');

  try {
    const decoded = jwt.verify(token, config.jwtSecret.trim()) as JwtPayload;
    req.userId = decoded.id;
  } catch (err) {
    logger.error('Invalid jwt token: ', (err as Error).message);
    throw appError;
  }

  return next();
};

export default authorized;
