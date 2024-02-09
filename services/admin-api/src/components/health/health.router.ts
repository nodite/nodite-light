import { Router } from 'express';

import health from '@/components/health/health.controller';

const router: Router = Router();

router.get('/health', health);

export default router;
