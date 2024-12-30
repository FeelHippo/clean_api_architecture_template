import { Router } from 'express';
import HealthCheckController from './health-check-controller';

const router = Router();
router.get('/ping', HealthCheckController.ping);

export default router;
