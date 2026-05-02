import { Router } from 'express';
import { adminAuth } from '../auth/auth.middleware';
import { AnalyticsService } from '../analytics/analytics.service';

const router = Router();
const analyticsService = new AnalyticsService();

router.use(adminAuth);

router.get('/analytics', async (req, res) => {
  const totalProfit = await analyticsService.totalProfit();
  const salesCount = await analyticsService.salesCount();
  const topItems = await analyticsService.topItems();

  res.json({ totalProfit, salesCount, topItems });
});

export default router;