import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RealtimeGateway } from '../realtime/realtime.gateway';

export type IngestListingInput = {
  externalId: string;
  title: string;
  price: number;
  url?: string | null;
  imageUrl?: string | null;
  currency?: string | null;
  shippingPrice?: number | null;
  shippingCurrency?: string | null;
  country?: string | null;
  condition?: string | null;
  sealed?: boolean | null;
  completenessPercent?: number | null;
  quantityAvailable?: number | null;
};

@Injectable()
export class ScannerService {
  constructor(
    private readonly prisma: PrismaService,
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

  private createListingId(sourceCode: string, externalId: string): string {
    const encoded = Buffer.from(externalId)
      .toString('base64')
      .replaceAll('=', '')
      .replaceAll('+', '-')
      .replaceAll('/', '_');

    return `${sourceCode}_${encoded}`;
  }

  private async getOrCreatePlaceholderItemId(): Promise<string> {
    const placeholder = await this.prisma.item.upsert({
      where: {
        id: 'item_unresolved_placeholder',
      },
      update: {},
      create: {
        id: 'item_unresolved_placeholder',
        kind: 'unknown',
        title: 'UNRESOLVED_PLACEHOLDER',
        conditionDefault: 'unknown',
      },
    });

    return placeholder.id;
  }

  private async enqueueUnresolvedMatch(params: {
    listingId: string;
    sourceCode: string;
    titleRaw: string;
    suggestedItemId?: string | null;
  }): Promise<void> {
    const existing = await this.prisma.unresolvedMatchQueue.findFirst({
      where: {
        listingId: params.listingId,
        status: 'pending',
      },
    });

    if (existing) {
      return;
    }

    await this.prisma.unresolvedMatchQueue.create({
      data: {
        listingId: params.listingId,
        sourceCode: params.sourceCode,
        titleRaw: params.titleRaw,
        normalizedTitle: this.normalizeTitle(params.titleRaw),
        extractedSetNo: this.extractSetNumber(params.titleRaw),
        suggestedItemId: params.suggestedItemId ?? null,
        status: 'pending',
      },
    });
  }

  private async resolveItemId(title: string): Promise<{
    itemId: string;
    resolved: boolean;
  }> {
    const setNumber = this.extractSetNumber(title);

    if (setNumber) {
      const exact = await this.prisma.item.findFirst({
        where: {
          setNumber,
        },
        select: {
          id: true,
        },
      });

      if (exact) {
        return {
          itemId: exact.id,
          resolved: true,
        };
      }
    }

    const normalized = this.normalizeTitle(title);

    const candidates = await this.prisma.item.findMany({
      select: {
        id: true,
        title: true,
        setNumber: true,
      },
      take: 500,
    });

    for (const candidate of candidates) {
      const normalizedCandidateTitle = this.normalizeTitle(candidate.title);

      if (
        normalized.includes(normalizedCandidateTitle) ||
        normalizedCandidateTitle.includes(normalized)
      ) {
        return {
          itemId: candidate.id,
          resolved: true,
        };
      }
    }

    return {
      itemId: await this.getOrCreatePlaceholderItemId(),
      resolved: false,
    };
  }

  async createSource(body: {
    code: string;
    name: string;
    type?: string | null;
    enabled?: boolean | null;
  }): Promise<unknown> {
    const code = body.code.trim().toLowerCase();
    const name = body.name.trim();

    const source = await this.prisma.marketSource.upsert({
      where: {
        code,
      },
      update: {
        name,
        type: body.type ?? 'manual',
        enabled: body.enabled ?? true,
      },
      create: {
        code,
        name,
        type: body.type ?? 'manual',
        enabled: body.enabled ?? true,
      },
    });

    this.realtime.emitCustom('scanner.source_saved', source);
    return source;
  }

  async getSources(): Promise<unknown[]> {
    return this.prisma.marketSource.findMany({
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  async enqueueScan(body: {
    sourceCode: string;
    query?: string | null;
  }): Promise<unknown> {
    const source = await this.prisma.marketSource.findUnique({
      where: {
        code: body.sourceCode,
      },
    });

    if (!source) {
      throw new NotFoundException('Source not found');
    }

    const job = await this.prisma.scanJob.create({
      data: {
        sourceCode: body.sourceCode,
        query: body.query ?? '',
        status: 'queued',
      },
    });

    this.realtime.emitCustom('scanner.job_queued', job);

    return job;
  }

  async getJobs(): Promise<unknown[]> {
    return this.prisma.scanJob.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: 100,
    });
  }

  async ingestListings(body: {
    sourceCode: string;
    listings: IngestListingInput[];
  }): Promise<unknown[]> {
    const source = await this.prisma.marketSource.findUnique({
      where: {
        code: body.sourceCode,
      },
    });

    if (!source) {
      throw new NotFoundException('Source not found');
    }

    const rows: unknown[] = [];
    let unresolved = 0;
    
    // БАТЧИНГ УСІХ ЗАПИСІВ У ЄДИНУ ТРАНЗАКЦІЮ (Pipelined Atomic Operation)
    // Жодних N+1, Prisma згортає це в один масивний пакет (batch)
    const upsertOperations = [];
    const unresolvedOperations = [];
    
    const now = new Date();

    for (const listing of body.listings) {
      if (!listing.externalId || !listing.title || !Number.isFinite(listing.price)) {
        continue;
      }

      const id = this.createListingId(body.sourceCode, listing.externalId);
      const resolved = await this.resolveItemId(listing.title);

      upsertOperations.push(
        this.prisma.marketListing.upsert({
          where: { id },
          update: {
            sourceCode: source.code,
            itemId: resolved.itemId,
            externalListingId: listing.externalId,
            externalId: listing.externalId,
            titleRaw: listing.title,
            title: listing.title,
            url: listing.url ?? '',
            imageUrl: listing.imageUrl,
            price: listing.price,
            currency: listing.currency ?? 'UAH',
            shippingPrice: listing.shippingPrice ?? null,
            shippingCurrency: listing.shippingCurrency ?? listing.currency ?? 'UAH',
            country: listing.country ?? 'UA',
            condition: listing.condition,
            sealed: listing.sealed,
            completenessPercent: listing.completenessPercent,
            quantityAvailable: listing.quantityAvailable ?? 1,
            status: 'active',
            fetchedAt: now,
            lastSeenAt: now,
          },
          create: {
            id,
            sourceId: source.id,
            sourceCode: source.code,
            itemId: resolved.itemId,
            externalListingId: listing.externalId,
            externalId: listing.externalId,
            titleRaw: listing.title,
            title: listing.title,
            url: listing.url ?? '',
            imageUrl: listing.imageUrl,
            price: listing.price,
            currency: listing.currency ?? 'UAH',
            shippingPrice: listing.shippingPrice ?? null,
            shippingCurrency: listing.shippingCurrency ?? listing.currency ?? 'UAH',
            country: listing.country ?? 'UA',
            condition: listing.condition,
            sealed: listing.sealed,
            completenessPercent: listing.completenessPercent,
            quantityAvailable: listing.quantityAvailable ?? 1,
            status: 'active',
            fetchedAt: now,
            firstSeenAt: now,
            lastSeenAt: now,
          },
        })
      );

      if (!resolved.resolved) {
        unresolved += 1;
        unresolvedOperations.push({
          listingId: id,
          sourceCode: body.sourceCode,
          titleRaw: listing.title,
        });
      }
    }

    if (upsertOperations.length > 0) {
      const results = await this.prisma.$transaction(upsertOperations);
      rows.push(...results);
    }
    
    // Process unresolved asynchronously after primary transaction to avoid locking
    for(const u of unresolvedOperations) {
        await this.enqueueUnresolvedMatch(u);
    }

    this.realtime.emitListingsRefresh({
      sourceCode: body.sourceCode,
      count: rows.length,
      unresolved,
    });

    this.realtime.emitOpportunityRefresh('scanner_ingest');

    return rows;
  }

  async getListings(params?: {
    sourceCode?: string;
    limit?: number;
  }): Promise<unknown[]> {
    const source = params?.sourceCode
      ? await this.prisma.marketSource.findUnique({
          where: {
            code: params.sourceCode,
          },
        })
      : null;

    return this.prisma.marketListing.findMany({
      where: source
        ? {
            sourceId: source.id,
          }
        : undefined,
      orderBy: {
        fetchedAt: 'desc',
      },
      take: params?.limit ?? 100,
      include: {
        source: true,
        item: true,
      },
    });
  }

  async markStaleMissingListings(sourceCode: string): Promise<unknown> {
    const source = await this.prisma.marketSource.findUnique({
      where: {
        code: sourceCode,
      },
    });

    if (!source) {
      throw new NotFoundException('Source not found');
    }

    const threshold = new Date(Date.now() - 1000 * 60 * 60 * 24);

    const result = await this.prisma.marketListing.updateMany({
      where: {
        sourceId: source.id,
        status: 'active',
        lastSeenAt: {
          lt: threshold,
        },
      },
      data: {
        status: 'stale',
      },
    });

    this.realtime.emitListingsRefresh({
      sourceCode,
      staleMarked: result.count,
    });

    return result;
  }
}