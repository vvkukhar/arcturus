import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RealtimeGateway } from '../realtime/realtime.gateway';
import { SyncService } from '../sync/sync.service';

@Injectable()
export class SourceRerunService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly syncService: SyncService,
    private readonly realtime: RealtimeGateway,
  ) {}

  async triggerSourceRerun(sourceCode: string): Promise<{
    sourceCode: string;
    accepted: boolean;
    message: string;
  }> {
    const source = await this.prisma.marketSource.findUnique({
      where: {
        code: sourceCode,
      },
    });

    if (!source) {
      throw new NotFoundException('Source not found');
    }

    const run = await this.prisma.sourceRunLog.create({
      data: {
        sourceId: source.id,
        startedAt: new Date(),
        finishedAt: new Date(),
        status: 'queued_manual_rerun',
        itemsSeen: 0,
        itemsMatched: 0,
        itemsInserted: 0,
        itemsUpdated: 0,
      },
    });

    await this.syncService.logSyncError({
      scope: 'source_rerun',
      sourceCode,
      message: 'Manual source rerun was requested',
      detailsJson: {
        sourceId: source.id,
        runId: run.id,
      },
    });

    this.realtime.emitCustom('source.rerun_requested', {
      sourceCode,
      runId: run.id,
    });

    return {
      sourceCode,
      accepted: true,
      message: 'Manual rerun request accepted',
    };
  }

  async toggleSource(sourceCode: string, enabled: boolean): Promise<unknown> {
    const source = await this.prisma.marketSource.findUnique({
      where: {
        code: sourceCode,
      },
    });

    if (!source) {
      throw new NotFoundException('Source not found');
    }

    const updated = await this.prisma.marketSource.update({
      where: {
        code: sourceCode,
      },
      data: {
        enabled,
      },
    });

    this.realtime.emitCustom('source.updated', {
      sourceCode,
      enabled,
    });

    return updated;
  }
}