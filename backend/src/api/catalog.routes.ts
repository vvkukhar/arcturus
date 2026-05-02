import { Router } from 'express';
import { CatalogService } from '../catalog/catalog.service';
import { adminAuth } from '../auth/auth.middleware';

const router = Router();
const service = new CatalogService();

router.get('/', async (req, res) => {
  const items = await service.list(req.query as any);
  res.json(items);
});

router.get('/:slug', async (req, res) => {
  const item = await service.getBySlug(req.params.slug);
  if (!item) return res.status(404).json({ message: 'Not found' });
  res.json(item);
});

router.post('/', adminAuth, async (req, res) => {
  const item = await service.create(req.body);
  res.json(item);
});

router.patch('/:slug', adminAuth, async (req, res) => {
  const item = await service.update(req.params.slug, req.body);
  res.json(item);
});

router.delete('/:slug', adminAuth, async (req, res) => {
  await service.delete(req.params.slug);
  res.json({ ok: true });
});

export default router;