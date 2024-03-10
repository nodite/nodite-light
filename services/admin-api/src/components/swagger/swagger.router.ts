import { AppError, config, logger } from '@nodite-light/admin-core';
import { NextFunction, Request, Response, Router } from 'express';
import httpStatus from 'http-status';
import swaggerUi from 'swagger-ui-express';

import swaggerDocument from '@/_tsoa/swagger.json';

swaggerDocument.servers[0].url = config.apiRootPath;

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

const router: Router = Router();

if (config.env !== 'production') {
  router.get('/swagger.json', swaggerJsonPath);
  router.use('/', swaggerUi.serve, swaggerDocsPath);
} else {
  router.get('/swagger.json', swaggerForbidden);
  router.use('/', swaggerForbidden);
}

export default router;
