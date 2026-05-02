import { ScannerService } from '../scanner/scanner.service';
import { SuggestionService, SuggestionItem } from '../suggestions/suggestions.service';
import { CatalogService } from '../catalog/catalog.service';
import { SocketService } from '../socket/socket.service';

export class JobQueue {
  private running = false;

  constructor(
    private scannerService = new ScannerService(),
    private suggestionService = new SuggestionService(),
    private catalogService = new CatalogService(),
    private socketService?: SocketService
  ) {}

  async process() {
    if (this.running) return;
    this.running = true;

    try {
      const jobs = await this.scannerService.listJobs();
      for (const job of jobs) {
        if (job.status !== 'queued') continue;
        await this.scannerService.updateStatus(job.id, 'running');

        // Simulate scanning / fetching
        await new Promise((res) => setTimeout(res, 1000));
        await this.scannerService.updateStatus(job.id, 'success');
      }

      // Generate suggestions after scanning
      const catalogItems = await this.catalogService.list();
      const suggestions: SuggestionItem[] = await this.suggestionService.generate(catalogItems);

      // Emit via socket if available
      if (this.socketService) {
        this.socketService.io?.emit('suggestionsUpdate', suggestions);
      }
    } finally {
      this.running = false;
    }
  }

  start(intervalMs: number = 5000) {
    setInterval(() => this.process(), intervalMs);
  }
}