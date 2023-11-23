import config from '@config/config';
import consts from '@config/consts';
import {
  swaggerBasePath,
  swaggerForbidden,
} from '@core/middlewares/swagger.middleware';
import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';

const router: Router = Router();

if (config.env !== 'production') {
  router.use(consts.API_DOCS_PATH, swaggerUi.serve, swaggerBasePath);
} else {
  router.use(consts.API_DOCS_PATH, swaggerForbidden);
}

export default router;
