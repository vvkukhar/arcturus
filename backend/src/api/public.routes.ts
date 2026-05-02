import { Router } from 'express';
import { CatalogService } from '../catalog/catalog.service';
import { DashboardService } from '../services/dashboard.service';
import { SuggestionService } from '../suggestions/suggestions.service';

const router = Router();
const catalogService = new CatalogService();
const dashboardService = new DashboardService();
const suggestionService = new SuggestionService();

router.get('/catalog', async (req, res) => {
  const { q, type, theme, sort, availableOnly } = req.query;
  const items = await catalogService.list({
    q: q as string,
    type: type as string,
    theme: theme as string,
    sort: sort as string,
    availableOnly: availableOnly === 'true',
  });
  res.json(items);
});

router.get('/catalog/:slug', async (req, res) => {
  const item = await catalogService.getBySlug(req.params.slug);
  if (!item) return res.status(404).json({ message: 'Item not found' });
  res.json(item);
});

router.get('/analytics', async (_req, res) => {
  const summary = await dashboardService.getExecutionSummary();
  const suggestions = await suggestionService.generate([]);
  res.json({ summary, suggestions });
});

export default router;