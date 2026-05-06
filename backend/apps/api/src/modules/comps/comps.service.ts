import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ActivityService } from '../activity/activity.service';
import { RealtimeGateway } from '../realtime/realtime.gateway';
import { toMoney } from '@arcturus/shared';

export type SoldCompInput = {
  externalId: string;
  title: string;
  soldPrice: number;
  soldAt?: string | Date | null;
  url?: string | null;
  currency?: string | null;
  sourceCode?: string | null;
  imageUrl?: string | null;
};

@Injectable()
export class CompsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly activity: ActivityService,
    private readonly realtime: RealtimeGateway,
  ) {}

  normalizeTitle(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s-]+/gu, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  extractSetNumber(title: string): string | null {
    const match = title.match(/\b\d{4,7}\b/);
    return match?.[0] ?? null;
  }

  async ingest(params: {
    sourceCode: string;
    comps: SoldCompInput[];
  }): Promise<unknown[]> {
    const sourceCode = params.sourceCode?.trim().toLowerCase();

    if (sourceCode) {
      await this.prisma.marketSource.upsert({
        where: {
          code: sourceCode,
        },
        update: {},
        create: {
          code: sourceCode,
          name: sourceCode,
          type: 'sold_comps',
          enabled: true,
        },
      });
    }

    const rows: unknown[] = [];

    for (const comp of params.comps ?? []) {
      if (!comp.externalId || !comp.title || !Number.isFinite(comp.soldPrice)) {
        continue;
      }

      const normalizedTitle = this.normalizeTitle(comp.title);
      const extractedSetNo = this.extractSetNumber(comp.title);

      const item = extractedSetNo
        ? await this.prisma.item.findFirst({
            where: {
              setNumber: extractedSetNo,
            },
          })
        : null;

      const row = await this.prisma.soldComp.upsert({
        where: {
          sourceCode_externalId: {
            sourceCode: comp.sourceCode ?? sourceCode,
            externalId: comp.externalId,
          },
        },
        update: {
          itemId: item?.id ?? null,
          title: comp.title,
          normalizedTitle,
          extractedSetNo,
          soldPrice: toMoney(comp.soldPrice),
          currency: comp.currency ?? 'UAH',
          soldAt: comp.soldAt ? new Date(comp.soldAt) : new Date(),
          url: comp.url ?? null,
          imageUrl: comp.imageUrl ?? null,
        },
        create: {
          sourceCode: comp.sourceCode ?? sourceCode,
          externalId: comp.externalId,
          itemId: item?.id ?? null,
          title: comp.title,
          normalizedTitle,
          extractedSetNo,
          soldPrice: toMoney(comp.soldPrice),
          currency: comp.currency ?? 'UAH',
          soldAt: comp.soldAt ? new Date(comp.soldAt) : new Date(),
          url: comp.url ?? null,
          imageUrl: comp.imageUrl ?? null,
        },
      });

      rows.push(row);
    }

    await this.activity.log('comps.ingested', {
      sourceCode,
      count: rows.length,
    });

    this.realtime.emitCustom('comps.ingested', {
      sourceCode,
      count: rows.length,
    });

    this.realtime.emitOpportunityRefresh('comps_ingested');

    return rows;
  }

  async list(params?: {
    q?: string;
    sourceCode?: string;
    extractedSetNo?: string;
    limit?: number;
  }): Promise<unknown[]> {
    const q = params?.q?.trim();

    return this.prisma.soldComp.findMany({
      where: {
        ...(params?.sourceCode
          ? {
              sourceCode: params.sourceCode,
            }
          : {}),
        ...(params?.extractedSetNo
          ? {
              extractedSetNo: params.extractedSetNo,
            }
          : {}),
        ...(q
          ? {
              OR: [
                {
                  title: {
                    contains: q,
                    mode: 'insensitive',
                  },
                },
                {
                  normalizedTitle: {
                    contains: this.normalizeTitle(q),
                    mode: 'insensitive',
                  },
                },
                {
                  extractedSetNo: {
                    contains: q,
                    mode: 'insensitive',
                  },
                },
              ],
            }
          : {}),
      },
      include: {
        item: true,
      },
      orderBy: {
        soldAt: 'desc',
      },
      take: params?.limit ?? 100,
    });
  }

  async summary(params: {
    itemId?: string;
    setNumber?: string;
    title?: string;
  }): Promise<unknown> {
    const item =
      params.itemId != null
        ? await this.prisma.item.findUnique({
            where: {
              id: params.itemId,
            },
          })
        : params.setNumber != null
          ? await this.prisma.item.findFirst({
              where: {
                setNumber: params.setNumber,
              },
            })
          : null;

    const normalizedTitle = params.title ? this.normalizeTitle(params.title) : null;

    const comps = await this.prisma.soldComp.findMany({
      where: {
        OR: [
          ...(item?.id
            ? [
                {
                  itemId: item.id,
                },
              ]
            : []),
          ...(item?.setNumber || params.setNumber
            ? [
                {
                  extractedSetNo: item?.setNumber ?? params.setNumber,
                },
              ]
            : []),
          ...(normalizedTitle
            ? [
                {
                  normalizedTitle: {
                    contains: normalizedTitle.slice(0, 24),
                    mode: 'insensitive' as const,
                  },
                },
              ]
            : []),
        ],
      },
      orderBy: {
        soldAt: 'desc',
      },
      take: 100,
    });

    const prices = comps
      .map((comp) => Number(comp.soldPrice))
      .filter((value) => Number.isFinite(value) && value > 0)
      .sort((a, b) => a - b);

    const count = prices.length;
    const min = count > 0 ? prices[0] : null;
    const max = count > 0 ? prices[count - 1] : null;
    const avg =
      count > 0 ? toMoney(prices.reduce((sum, value) => sum + value, 0) / count) : null;

    const median =
      count === 0
        ? null
        : count % 2 === 0
          ? toMoney((prices[count / 2 - 1] + prices[count / 2]) / 2)
          : prices[Math.floor(count / 2)];

    return {
      item,
      count,
      min,
      max,
      avg,
      median,
      latestSoldAt: comps[0]?.soldAt ?? null,
      comps: comps.slice(0, 30),
    };
  }
}