import protectedByApiKey from '@core/middlewares/apiKey.middleware';
import validation from '@core/middlewares/validate.middleware';
import { Router } from 'express';

import createUserValidation from './createUser.validation';
import {
  createUser,
  deleteUser,
  readUser,
  updateUser,
} from './user.controller';

const router: Router = Router();

// e.g. createUser request's body is validated and protected by api-key
router.post(
  '/user/',
  [protectedByApiKey, validation(createUserValidation)],
  createUser,
);
router.get('/user/:id', readUser);
router.put('/user/:id', [protectedByApiKey], updateUser);
router.delete('/user/:id', [protectedByApiKey], deleteUser);

export default router;
