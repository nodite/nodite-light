import config from '@nodite-light/admin-core/lib/config/config';
import consts from '@nodite-light/admin-core/lib/config/consts';
import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';

import {
  swaggerDocsPath,
  swaggerForbidden,
  swaggerJsonPath,
} from '@/middlewares/swagger.middleware';

const router: Router = Router();
if (config.env !== 'production') {
  router.get(`${consts.API_DOCS_PATH}/swagger.json`, swaggerJsonPath);
  router.use(consts.API_DOCS_PATH, swaggerUi.serve, swaggerDocsPath);
} else {
  router.get(`${consts.API_DOCS_PATH}/swagger.json`, swaggerForbidden);
  router.use(consts.API_DOCS_PATH, swaggerForbidden);
}

export default router;
