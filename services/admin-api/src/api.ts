/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/default-param-last */
import { RegisterRoutes } from '@dotsoa/routes';
import { Router } from 'express';
import { ValidationService } from 'tsoa';

// disable tsoa validation.
// @see https://github.com/lukeautry/tsoa/issues/181#issuecomment-1487811378
ValidationService.prototype.ValidateParam = (
  _property,
  rawValue,
  _name = '',
  _fieldErrors,
  _parent = '',
  _minimalSwaggerConfig,
) => rawValue;

RegisterRoutes.prototype.getValidatedArgs = (
  args: never,
  _request: never,
  _response: never,
) => Object.keys(args);

const router: Router = Router();
RegisterRoutes(router);

export default router;
