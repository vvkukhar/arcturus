import { Injectable, Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { PrismaService } from '../prisma/prisma.service';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { QUEUE_NAMES, JOB_NAMES } from '../queue/queue.constants';
import * as crypto from 'crypto';

@Injectable()
export class RealtimeGateway {
  private readonly logger = new Logger(RealtimeGateway.name);
  private server: Server | null = null;
  private itemRooms = new Map<string, Set<string>>();
  private surgeInterval: NodeJS.Timeout | null = null;

  constructor(
    private readonly prisma: PrismaService,
    @InjectQueue(QUEUE_NAMES.MARKET) private readonly marketQueue: Queue
  ) {}

  public setServer(server: Server): void {
    this.server = server;
    this.startSurgePricingCron();
  }

  private startSurgePricingCron() {
    if (this.surgeInterval) clearInterval(this.surgeInterval);
    this.surgeInterval = setInterval(() => {
      const activeSessions = Array.from(this.itemRooms.entries())
        .map(([itemId, clients]) => [itemId, clients.size] as [string, number])
        .filter(([_, size]) => size >= 3);

      if (activeSessions.length > 0) {
        this.marketQueue.add(JOB_NAMES.SURGE_PRICING, { activeSessions }, { removeOnComplete: 5, removeOnFail: 10 });
      }
    }, 1000 * 60 * 5);
  }

  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  private extractToken(client: Socket): string | null {
    const cookieHeader = client.handshake.headers?.cookie;
    if (cookieHeader) {
      const match = cookieHeader.match(/(^| )arcturus_admin_token=([^;]+)/);
      if (match) return decodeURIComponent(match[2]);
    }
    const rawToken = client.handshake.auth?.token || client.handshake.headers?.authorization;
    if (!rawToken || typeof rawToken !== 'string') return null;
    return rawToken.replace('Bearer ', '').trim();
  }

  async handleConnection(client: Socket): Promise<void> {
    const cleanToken = this.extractToken(client);

    client.on('join_item_room', (itemId: string) => {
      client.join(`item_${itemId}`);
      if (!this.itemRooms.has(itemId)) this.itemRooms.set(itemId, new Set());
      this.itemRooms.get(itemId)!.add(client.id);
      
      this.server?.to(`item_${itemId}`).emit('viewers_update', this.itemRooms.get(itemId)!.size);
    });

    client.on('leave_item_room', (itemId: string) => {
      client.leave(`item_${itemId}`);
      if (this.itemRooms.has(itemId)) {
        this.itemRooms.get(itemId)!.delete(client.id);
        this.server?.to(`item_${itemId}`).emit('viewers_update', this.itemRooms.get(itemId)!.size);
      }
    });

    if (!cleanToken) return;

    try {
      const tokenHash = this.hashToken(cleanToken);
      const session = await this.prisma.userSession.findUnique({
        where: { tokenHash },
        include: { user: true },
      });

      if (!session || !(session as any).user?.active || (session.expiresAt && session.expiresAt.getTime() < Date.now())) {
        return;
      }

      client.join('admin_broadcast');
    } catch (error) {}
  }

  handleDisconnect(client: Socket): void {
    this.itemRooms.forEach((clients, itemId) => {
      if (clients.has(client.id)) {
        clients.delete(client.id);
        this.server?.to(`item_${itemId}`).emit('viewers_update', clients.size);
      }
    });
  }

  emitCustom(event: string, payload: any): void {
    this.server?.to('admin_broadcast').emit(event, payload);
  }

  emitDashboardRefresh(reason: string): void {
    this.server?.to('admin_broadcast').emit('dashboard_refresh', { reason, timestamp: Date.now() });
  }

  emitFlowRefresh(flow: string): void {
    this.server?.to('admin_broadcast').emit('flow_refresh', { flow, timestamp: Date.now() });
  }

  emitInventoryRefresh(payload: any): void {
    this.server?.to('admin_broadcast').emit('inventory_updated', { ...payload, timestamp: Date.now() });
  }

  emitInventoryUpdated(payload: any): void {
    this.server?.to('admin_broadcast').emit('inventory_updated', { ...payload, timestamp: Date.now() });
  }

  emitWatchlistUpdated(payload: any): void {
    this.server?.to('admin_broadcast').emit('watchlist_updated', { ...payload, timestamp: Date.now() });
  }

  emitWatchlistRefresh(payload: any): void {
    this.server?.to('admin_broadcast').emit('watchlist_updated', { ...payload, timestamp: Date.now() });
  }

  emitOpportunityRefresh(reason: string): void {
    this.server?.to('admin_broadcast').emit('opportunity_refresh', { reason, timestamp: Date.now() });
  }

  emitItemRefresh(itemId: string, reason: string): void {
    this.server?.to('admin_broadcast').emit('item_refresh', { itemId, reason, timestamp: Date.now() });
  }

  emitListingsRefresh(payload: any): void {
    this.server?.emit('listings_refresh', { ...payload, timestamp: Date.now() });
  }
}