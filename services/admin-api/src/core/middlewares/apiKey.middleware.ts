import config from '@config/config';
import AppError from '@core/utils/appError';
import logger from '@core/utils/logger';
import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';

const apiKey = (req: Request, res: Response, next: NextFunction) => {
  let xApiKey: string | undefined;
  const token: string = config.xApiKey;
  if (req.header('x-api-key')) {
    xApiKey = req.header('x-api-key')?.trim();
  }
  if (!!token && xApiKey === token.trim()) {
    return next();
  }
  logger.error(
    'Missing x-api-key in request header or it does not match with env variable',
  );
  throw new AppError(
    httpStatus.UNAUTHORIZED,
    'Access forbidden: invalid x-api-key',
  );
};

export default apiKey;
