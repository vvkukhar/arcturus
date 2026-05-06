import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

type SyncStatusResult = {
  itemId: string;
  latestSnapshotAt: Date | null;
  latestDecisionAt: Date | null;
  latestListingAt: Date | null;
  snapshotFreshnessLabel: string;
  listingFreshnessLabel: string;
  needsRefresh: boolean;
};

@Injectable()
export class SyncService {
  constructor(private readonly prisma: PrismaService) {}

  private freshnessLabel(date: Date | null): string {
    if (date == null) return 'missing';
    const diffHours = (Date.now() - date.getTime()) / (1000 * 60 * 60);
    if (diffHours <= 6) return 'fresh';
    if (diffHours <= 24) return 'recent';
    if (diffHours <= 72) return 'aging';
    if (diffHours <= 168) return 'stale';
    return 'very_stale';
  }

  private needsRefresh(date: Date | null): boolean {
    if (date == null) return true;
    return (Date.now() - date.getTime()) / (1000 * 60 * 60) > 24;
  }

  async logSyncError(params: { scope: string; sourceCode?: string; referenceId?: string; message: string; detailsJson?: object }): Promise<unknown> {
    return this.prisma.syncErrorLog.create({
      data: {
        scope: params.scope,
        sourceCode: params.sourceCode,
        referenceId: params.referenceId,
        message: params.message,
        detailsJson: params.detailsJson ?? {},
      },
    });
  }

  async getItemSyncStatus(itemId: string): Promise<SyncStatusResult> {
    const [latestSnapshot, latestDecision, latestListing] = await Promise.all([
      this.prisma.marketSnapshot.findFirst({ where: { itemId }, orderBy: { computedAt: 'desc' }, select: { computedAt: true } }),
      this.prisma.decisionSnapshot.findFirst({ where: { itemId }, orderBy: { createdAt: 'desc' }, select: { createdAt: true } }),
      this.prisma.marketListing.findFirst({ where: { itemId }, orderBy: { fetchedAt: 'desc' }, select: { fetchedAt: true } }),
    ]);

    const snapshotDate = latestSnapshot?.computedAt ?? null;
    const listingDate = latestListing?.fetchedAt ?? null;

    return {
      itemId,
      latestSnapshotAt: snapshotDate,
      latestDecisionAt: latestDecision?.createdAt ?? null,
      latestListingAt: listingDate,
      snapshotFreshnessLabel: this.freshnessLabel(snapshotDate),
      listingFreshnessLabel: this.freshnessLabel(listingDate),
      needsRefresh: this.needsRefresh(snapshotDate) || this.needsRefresh(listingDate),
    };
  }

  async getDashboardSyncSummary(): Promise<{ totalItems: number; fresh: number; recent: number; aging: number; stale: number; veryStale: number; missing: number; needsRefresh: number; }> {
    const snapshots = await this.prisma.marketSnapshot.findMany({
      distinct: ['itemId'],
      orderBy: { computedAt: 'desc' },
      select: { computedAt: true }
    });
    
    const totalItems = await this.prisma.item.count();
    
    let fresh = 0, recent = 0, aging = 0, stale = 0, veryStale = 0, missing = totalItems - snapshots.length, needsRefresh = missing;

    for (const snap of snapshots) {
      const date = snap.computedAt;
      const label = this.freshnessLabel(date);
      if (label === 'fresh') fresh += 1;
      else if (label === 'recent') recent += 1;
      else if (label === 'aging') aging += 1;
      else if (label === 'stale') stale += 1;
      else if (label === 'very_stale') veryStale += 1;
      if (this.needsRefresh(date)) needsRefresh += 1;
    }

    return { totalItems, fresh, recent, aging, stale, veryStale, missing, needsRefresh };
  }

  async getCriticalSyncItems(limit = 50): Promise<unknown[]> {
    const items = await this.prisma.item.findMany({ select: { id: true, title: true, setNumber: true, theme: true }, take: 500, orderBy: { title: 'asc' } });
    if (items.length === 0) return [];

    const itemIds = items.map(i => i.id);

    const [snapshots, decisions, listings] = await Promise.all([
      this.prisma.marketSnapshot.findMany({ where: { itemId: { in: itemIds } }, distinct: ['itemId'], orderBy: { computedAt: 'desc' }, select: { itemId: true, computedAt: true } }),
      this.prisma.decisionSnapshot.findMany({ where: { itemId: { in: itemIds } }, distinct: ['itemId'], orderBy: { createdAt: 'desc' }, select: { itemId: true, createdAt: true } }),
      this.prisma.marketListing.findMany({ where: { itemId: { in: itemIds } }, distinct: ['itemId'], orderBy: { fetchedAt: 'desc' }, select: { itemId: true, fetchedAt: true } })
    ]);

    const snapMap = new Map(snapshots.map(s => [s.itemId, s.computedAt]));
    const decMap = new Map(decisions.map(d => [d.itemId, d.createdAt]));
    const listMap = new Map(listings.map(l => [l.itemId, l.fetchedAt]));

    const rows = items.map((item) => {
      const snapshotDate = snapMap.get(item.id) ?? null;
      const listingDate = listMap.get(item.id) ?? null;

      return {
        ...item,
        itemId: item.id,
        latestSnapshotAt: snapshotDate,
        latestDecisionAt: decMap.get(item.id) ?? null,
        latestListingAt: listingDate,
        snapshotFreshnessLabel: this.freshnessLabel(snapshotDate),
        listingFreshnessLabel: this.freshnessLabel(listingDate),
        needsRefresh: this.needsRefresh(snapshotDate) || this.needsRefresh(listingDate),
      };
    });

    return rows
      .filter((row) => row.needsRefresh)
      .sort((a, b) => {
        const order: Record<string, number> = { missing: 0, very_stale: 1, stale: 2, aging: 3, recent: 4, fresh: 5 };
        return (order[a.snapshotFreshnessLabel] ?? 99) - (order[b.snapshotFreshnessLabel] ?? 99);
      })
      .slice(0, limit);
  }
}