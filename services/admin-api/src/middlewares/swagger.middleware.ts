import { AppError, consts, logger } from '@nodite-light/admin-core';
import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import swaggerUi from 'swagger-ui-express';

import swaggerDocument from '@/_tsoa/swagger.json';

swaggerDocument.servers[0].url = consts.API_ROOT_PATH;

const swaggerForbidden = () => {
  logger.error('Trying to access swagger docs on production');
  throw new AppError(httpStatus.FORBIDDEN, 'API docs are not available on production');
};

const swaggerJsonPath = (req: Request, res: Response) => {
  return res.json(swaggerDocument);
};

const swaggerDocsPath = (req: Request, res: Response, next: NextFunction) => {
  swaggerUi.setup(swaggerDocument, {})(req, res, () => {
    next();
  });
};

export { swaggerDocsPath, swaggerForbidden, swaggerJsonPath };
