import { Router } from 'express';

import healthcheck from './healthCheck.controller';

const router: Router = Router();

router.get('/health', healthcheck);

export default router;
