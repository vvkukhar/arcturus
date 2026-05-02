import { Router } from 'express';
import { JobQueue } from '../jobs/job-queue';
import { ScannerService } from '../scanner/scanner.service';

const router = Router();
const queue = new JobQueue();
const scanner = new ScannerService();

router.post('/scanner/enqueue', async (req, res) => {
  const { sourceCode, query } = req.body;
  const job = await scanner.enqueue(sourceCode, query);
  res.json(job);
});

router.get('/scanner/jobs', async (_req, res) => {
  const jobs = await scanner.listJobs();
  res.json(jobs);
});

router.post('/queue/start', (_req, res) => {
  queue.start();
  res.json({ status: 'started' });
});

export default router;