import { AppError, config, logger } from '@nodite-light/admin-core';
import { NextFunction, Request, Response } from 'express';
import { unless } from 'express-unless';
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

  logger.error('Missing x-api-key in request header or it does not match with env variable');

  return next(new AppError(httpStatus.UNAUTHORIZED, 'Access forbidden: invalid x-api-key'));
};

// add unless method to middleware.
apiKey.unless = unless;

// export middleware
export default apiKey;
