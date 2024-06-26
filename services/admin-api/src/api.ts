/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/default-param-last */
import '@nodite-light/admin-database/lib/connect';

import { Router } from 'express';
import { ValidationService } from 'tsoa';

import { RegisterRoutes } from '@/_tsoa/routes';
import health from '@/components/health/health.router';
import SwaggerRouter from '@/components/swagger/swagger.router';

const router: Router = Router();

// disable tsoa validation.
// @see https://github.com/lukeautry/tsoa/issues/181#issuecomment-1487811378
ValidationService.prototype.ValidateParam = (
  property,
  rawValue,
  name = '',
  fieldErrors,
  isBodyParam,
  parent = '',
) => rawValue;

RegisterRoutes.prototype.getValidatedArgs = (args: unknown, request: unknown, response: unknown) =>
  Object.keys(args);

RegisterRoutes(router);

// Add Swagger API documentation
router.use('/api-docs', SwaggerRouter);

// Add health check
router.use(health);

export default router;
