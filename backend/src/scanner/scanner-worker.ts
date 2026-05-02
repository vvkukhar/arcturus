import { ScannerService } from './scanner.service';
import { JobQueue } from '../jobs/job-queue';

async function runWorker() {
  const scanner = new ScannerService();
  const queue = new JobQueue(scanner);

  console.log('Scanner worker started...');
  setInterval(async () => {
    try {
      await queue.process();
    } catch (err) {
      console.error('Error processing queue:', err);
    }
  }, 3000);
}

runWorker();