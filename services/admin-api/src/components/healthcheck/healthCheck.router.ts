import healthcheck from '@components/healthcheck/healthCheck.controller';
import { Router } from 'express';

const router: Router = Router();

router.get('/health', healthcheck);

export default router;
