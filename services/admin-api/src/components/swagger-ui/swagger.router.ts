import config from '@config/config';
import consts from '@config/consts';
import {
  swaggerDocsPath,
  swaggerForbidden,
  swaggerJsonPath,
} from '@core/middlewares/swagger.middleware';
import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';

const router: Router = Router();
if (config.env !== 'production') {
  router.get(`${consts.API_DOCS_PATH}/swagger.json`, swaggerJsonPath);
  router.use(consts.API_DOCS_PATH, swaggerUi.serve, swaggerDocsPath);
} else {
  router.get(`${consts.API_DOCS_PATH}/swagger.json`, swaggerForbidden);
  router.use(consts.API_DOCS_PATH, swaggerForbidden);
}

export default router;
