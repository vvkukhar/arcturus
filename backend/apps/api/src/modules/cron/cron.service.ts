import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { RepricerService } from '../repricer/repricer.service';
import { MarketSnapshotService } from '../market/market-snapshot.service';
import { DealDetectionService } from '../deals/deal-detection.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);

  constructor(
    private readonly repricer: RepricerService,
    private readonly snapshot: MarketSnapshotService,
    private readonly dealDetection: DealDetectionService,
    private readonly prisma: PrismaService,
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  async handleMarketSnapshots() {
    this.logger.log('Starting hourly market snapshot recomputation...');
    try {
      const count = await this.snapshot.recomputeAllActive();
      this.logger.log(`Successfully recomputed ${count} market snapshots.`);
    } catch (error) {
      this.logger.error('Failed to recompute market snapshots', error);
    }
  }

  @Cron(CronExpression.EVERY_30_MINUTES)
  async handleAutoReprice() {
    this.logger.log('Starting automated reprice flow processing...');
    try {
      const count = await this.repricer.processRepriceQueue();
      this.logger.log(`Automatically repriced ${count} inventory items.`);
    } catch (error) {
      this.logger.error('Failed to process reprice queue', error);
    }
  }

  @Cron(CronExpression.EVERY_10_MINUTES)
  async handleDealPruning() {
    this.logger.log('Pruning stale and missed arbitrage deals...');
    try {
      await this.dealDetection.pruneStaleDeals();
      this.logger.log('Pruning complete.');
    } catch (error) {
      this.logger.error('Failed to prune deals', error);
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleSystemCleanup() {
    this.logger.log('Running daily database cleanup and optimization...');
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      await this.prisma.sourceRunLog.deleteMany({
        where: { createdAt: { lt: thirtyDaysAgo } },
      });

      await this.prisma.activityLog.deleteMany({
        where: { createdAt: { lt: thirtyDaysAgo } },
      });

      this.logger.log('Daily cleanup successful.');
    } catch (error) {
      this.logger.error('Failed daily cleanup', error);
    }
  }
}