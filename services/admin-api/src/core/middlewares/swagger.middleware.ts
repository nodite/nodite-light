import consts from '@config/consts';
import AppError from '@core/utils/appError';
import logger from '@core/utils/logger';
import swaggerDocument from '@dotsoa/swagger.json';
import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import swaggerUi from 'swagger-ui-express';

const swaggerForbidden = () => {
  logger.error('Trying to access swagger docs on production');
  throw new AppError(
    httpStatus.FORBIDDEN,
    'API docs are not available on production',
  );
};

const swaggerBasePath = (req: Request, res: Response, next: NextFunction) => {
  swaggerDocument.servers[0].url = consts.API_ROOT_PATH;
  swaggerUi.setup(swaggerDocument)(req, res, () => {
    next();
  });
};

export { swaggerBasePath, swaggerForbidden };
