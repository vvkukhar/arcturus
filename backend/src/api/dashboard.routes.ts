import { Router } from 'express';
import { DashboardService } from '../services/dashboard.service';

const router = Router();
const service = new DashboardService();

router.get('/summary', async (_req, res) => {
  const summary = await service.getExecutionSummary();
  res.json(summary);
});

export default router;