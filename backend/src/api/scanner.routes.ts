import { Router } from 'express';
import { ScannerService } from '../scanner/scanner.service';
import { adminAuth } from '../auth/auth.middleware';

const router = Router();
const service = new ScannerService();

router.use(adminAuth);

router.post('/enqueue', async (req, res) => {
  const { sourceCode, query } = req.body;
  const job = await service.enqueue(sourceCode, query);
  res.json(job);
});

router.get('/jobs', async (req, res) => {
  const jobs = await service.listJobs();
  res.json(jobs);
});

router.get('/sources', async (req, res) => {
  const sources = await service.listSources();
  res.json(sources);
});

export default router;