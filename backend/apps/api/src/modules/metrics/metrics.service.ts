import { Injectable } from '@nestjs/common';
import { Queue, type ConnectionOptions } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';

function redisConnection(): ConnectionOptions {
  const redisUrl = process.env.REDIS_URL?.trim();
  if (redisUrl) return { url: redisUrl, maxRetriesPerRequest: null };
  return {
    host: process.env.REDIS_HOST ?? 'localhost',
    port: Number(process.env.REDIS_PORT ?? 6379),
    password: process.env.REDIS_PASSWORD || undefined,
    maxRetriesPerRequest: null,
  };
}

@Injectable()
export class MetricsService {
  constructor(private readonly prisma: PrismaService) {}

  private formatMetric(name: string, value: number, labels?: Record<string, string>): string {
    const labelText = labels
      ? `{${Object.entries(labels).map(([key, val]) => `${key}="${val.replace(/"/g, '\\"')}"`).join(',')}}`
      : '';
    return `${name}${labelText} ${value}`;
  }

  async getJsonMetrics(): Promise<unknown> {
    const startedAt = Date.now();

    const [
      items, inventory, watchlist, listings, dealsOpen, decisions, buyNowDecisions,
      repriceDecisions, sales, orders, openOrders, returns, openReturns, expenses,
      purchaseOrders, openPurchaseOrders, reports, notificationsUnread, syncErrors,
      purchasePending, repricePending, reviewPending, unresolvedPending,
    ] = await Promise.all([
      this.prisma.item.count(),
      this.prisma.inventoryItem.count(),
      this.prisma.watchlistItem.count(),
      this.prisma.marketListing.count(),
      this.prisma.deal.count({ where: { status: 'open' } }),
      this.prisma.decisionSnapshot.count(),
      this.prisma.decisionSnapshot.count({ where: { action: 'BUY_NOW' } }),
      this.prisma.decisionSnapshot.count({ where: { action: { in: ['REPRICE_UP', 'REPRICE_UP_OR_REVIEW'] } } }),
      this.prisma.sale.count(),
      this.prisma.order.count(),
      this.prisma.order.count({ where: { status: { in: ['pending', 'approved', 'contacted'] } } }),
      this.prisma.returnRequest.count(),
      this.prisma.returnRequest.count({ where: { status: { in: ['requested', 'approved'] } } }),
      this.prisma.expense.count(),
      this.prisma.purchaseOrder.count(),
      this.prisma.purchaseOrder.count({ where: { status: { in: ['planned', 'approved', 'ordered', 'paid'] } } }),
      this.prisma.reportSnapshot.count(),
      this.prisma.notification.count({ where: { read: false } }),
      this.prisma.syncErrorLog.count(),
      this.prisma.purchaseFlowItem.count({ where: { status: 'pending' } }),
      this.prisma.repriceFlowItem.count({ where: { status: 'pending' } }),
      this.prisma.reviewFlowItem.count({ where: { status: 'pending' } }),
      this.prisma.unresolvedMatchQueue.count({ where: { status: 'pending' } }),
    ]);

    return {
      service: 'arcturus-api',
      uptimeSec: Math.round(process.uptime()),
      latencyMs: Date.now() - startedAt,
      counters: {
        items, inventory, watchlist, listings, dealsOpen, decisions, buyNowDecisions,
        repriceDecisions, sales, orders, openOrders, returns, openReturns, expenses,
        purchaseOrders, openPurchaseOrders, reports, notificationsUnread, syncErrors,
        purchasePending, repricePending, reviewPending, unresolvedPending,
      },
    };
  }

  async getPrometheusMetrics(): Promise<string> {
    const metrics = (await this.getJsonMetrics()) as any;
    const lines = [
      '# HELP arcturus_api_uptime_seconds API uptime in seconds',
      '# TYPE arcturus_api_uptime_seconds gauge',
      this.formatMetric('arcturus_api_uptime_seconds', metrics.uptimeSec),
      '# HELP arcturus_api_latency_ms Internal metrics endpoint latency',
      '# TYPE arcturus_api_latency_ms gauge',
      this.formatMetric('arcturus_api_latency_ms', metrics.latencyMs),
    ];

    for (const [key, value] of Object.entries(metrics.counters)) {
      lines.push(`# TYPE arcturus_${key} gauge`);
      lines.push(this.formatMetric(`arcturus_${key}`, Number(value)));
    }
    return `${lines.join('\n')}\n`;
  }

  async getQueueHealth(): Promise<unknown[]> {
    const queueNames = ['market', 'decisions', 'scraper', 'maintenance'];
    const connection = redisConnection();
    const result = [];

    for (const name of queueNames) {
      const queue = new Queue(name, { connection });
      const [waiting, active, completed, failed, delayed] = await Promise.all([
        queue.getWaitingCount(), queue.getActiveCount(), queue.getCompletedCount(),
        queue.getFailedCount(), queue.getDelayedCount(),
      ]);

      result.push({ name, waiting, active, completed, failed, delayed, healthy: failed < 20 });
      await queue.close();
    }
    return result;
  }

  async getDbHealth(): Promise<unknown> {
    const startedAt = Date.now();
    await this.prisma.$queryRaw`SELECT 1`;

    const [
      activityLatest, listingLatest, decisionLatest, saleLatest,
      orderLatest, returnLatest, expenseLatest, reportLatest, purchaseOrderLatest,
    ] = await Promise.all([
      this.prisma.activityLog.findFirst({ orderBy: { createdAt: 'desc' }, select: { createdAt: true } }),
      this.prisma.marketListing.findFirst({ orderBy: { fetchedAt: 'desc' }, select: { fetchedAt: true } }),
      this.prisma.decisionSnapshot.findFirst({ orderBy: { createdAt: 'desc' }, select: { createdAt: true } }),
      this.prisma.sale.findFirst({ orderBy: { createdAt: 'desc' }, select: { createdAt: true } }),
      this.prisma.order.findFirst({ orderBy: { createdAt: 'desc' }, select: { createdAt: true } }),
      this.prisma.returnRequest.findFirst({ orderBy: { createdAt: 'desc' }, select: { createdAt: true } }),
      this.prisma.expense.findFirst({ orderBy: { createdAt: 'desc' }, select: { createdAt: true } }),
      this.prisma.reportSnapshot.findFirst({ orderBy: { createdAt: 'desc' }, select: { createdAt: true } }),
      this.prisma.purchaseOrder.findFirst({ orderBy: { createdAt: 'desc' }, select: { createdAt: true } }),
    ]);

    return {
      ok: true,
      latencyMs: Date.now() - startedAt,
      latest: {
        activityAt: activityLatest?.createdAt ?? null,
        listingFetchedAt: listingLatest?.fetchedAt ?? null,
        decisionAt: decisionLatest?.createdAt ?? null,
        saleAt: saleLatest?.createdAt ?? null,
        orderAt: orderLatest?.createdAt ?? null,
        returnAt: returnLatest?.createdAt ?? null,
        expenseAt: expenseLatest?.createdAt ?? null,
        reportAt: reportLatest?.createdAt ?? null,
        purchaseOrderAt: purchaseOrderLatest?.createdAt ?? null,
      },
    };
  }
}