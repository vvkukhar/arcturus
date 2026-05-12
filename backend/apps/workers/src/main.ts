import { registerRepeatableJobs } from './queue/scheduler';
import { startWorkers } from './queue/worker';

async function bootstrap() {
  await registerRepeatableJobs();
  startWorkers();
}

bootstrap().catch(console.error);