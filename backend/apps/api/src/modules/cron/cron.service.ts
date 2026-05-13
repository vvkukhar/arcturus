import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ModuleRef } from '@nestjs/core';
import { RepricerService } from '../repricer/repricer.service';
import { MarketSnapshotService } from '../market/market-snapshot.service';
import { DealDetectionService } from '../deals/deal-detection.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);

  constructor(
    private readonly moduleRef: ModuleRef,
    private readonly prisma: PrismaService,
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  async handleMarketSnapshots() {
    try {
      const snapshot = this.moduleRef.get(MarketSnapshotService, { strict: false });
      await snapshot.recomputeAllActive();
    } catch (error) {}
  }

  @Cron(CronExpression.EVERY_30_MINUTES)
  async handleAutoReprice() {
    try {
      const repricer = this.moduleRef.get(RepricerService, { strict: false });
      await repricer.processRepriceQueue();
    } catch (error) {}
  }

  @Cron(CronExpression.EVERY_10_MINUTES)
  async handleDealPruning() {
    try {
      const dealDetection = this.moduleRef.get(DealDetectionService, { strict: false });
      await dealDetection.pruneStaleDeals();
    } catch (error) {}
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleSystemCleanup() {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      await this.prisma.sourceRunLog.deleteMany({
        where: { createdAt: { lt: thirtyDaysAgo } },
      });

      await this.prisma.activityLog.deleteMany({
        where: { createdAt: { lt: thirtyDaysAgo } },
      });
    } catch (error) {}
  }
}