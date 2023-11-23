import healthCheck from '@components/healthcheck/healthCheck.router';
import user from '@components/user/user.router';
import { Router } from 'express';

const router: Router = Router();
router.use(healthCheck);
router.use(user);

export default router;
