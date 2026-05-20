import { Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { PrismaService } from '../prisma/prisma.service';
import * as crypto from 'crypto';

@Injectable()
export class RealtimeGateway {
  private server: Server | null = null;

  constructor(private readonly prisma: PrismaService) {
    console.log('[RealtimeGateway] INITIALIZED AS RAW SOCKET SERVICE');
  }

  public setServer(server: Server): void {
    this.server = server;
    console.log('[RealtimeGateway] RAW SOCKET.IO SERVER ATTACHED');
  }

  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  private extractToken(client: Socket): string | null {
    const authToken = client.handshake.auth?.token;

    const authorizationHeader = client.handshake.headers?.authorization;
    const headerToken = Array.isArray(authorizationHeader)
      ? authorizationHeader[0]
      : authorizationHeader;

    const queryToken = client.handshake.query?.token;
    const queryTokenString = Array.isArray(queryToken)
      ? queryToken[0]
      : queryToken;

    const rawToken = authToken || headerToken || queryTokenString;

    if (!rawToken || typeof rawToken !== 'string') {
      return null;
    }

    return rawToken.replace('Bearer ', '').trim();
  }

  async handleConnection(client: Socket): Promise<void> {
    console.log(`[RealtimeGateway] CONNECTION_ATTEMPT: ${client.id}`);
    console.log(`[RealtimeGateway] HEADERS:`, JSON.stringify(client.handshake.headers));
    console.log(`[RealtimeGateway] AUTH:`, JSON.stringify(client.handshake.auth));
    console.log(`[RealtimeGateway] QUERY:`, JSON.stringify(client.handshake.query));

    try {
      const cleanToken = this.extractToken(client);

      if (!cleanToken) {
        console.error(`[RealtimeGateway] CONNECTION_REJECTED: No token provided for ${client.id}`);
        client.disconnect(true);
        return;
      }

      const tokenHash = this.hashToken(cleanToken);
      console.log(`[RealtimeGateway] TOKEN_HASH: ${tokenHash}`);

      const session = await this.prisma.userSession.findUnique({
        where: { tokenHash },
        include: { user: true },
      });

      if (!session) {
        console.error(`[RealtimeGateway] CONNECTION_REJECTED: Session not found for ${client.id}`);
        client.disconnect(true);
        return;
      }

      if (!(session as any).user?.active) {
        console.error(`[RealtimeGateway] CONNECTION_REJECTED: User inactive for ${client.id}`);
        client.disconnect(true);
        return;
      }

      if (session.expiresAt && session.expiresAt.getTime() < Date.now()) {
        console.error(`[RealtimeGateway] CONNECTION_REJECTED: Session expired for ${client.id}`);
        client.disconnect(true);
        return;
      }

      console.log(
        `[RealtimeGateway] CONNECTION_SUCCESS: User ${(session as any).user.email} joined admin_broadcast (${client.id})`,
      );

      client.join('admin_broadcast');

      client.emit('socket_ready', {
        ok: true,
        socketId: client.id,
        timestamp: Date.now(),
      });
    } catch (error) {
      console.error(`[RealtimeGateway] CONNECTION_ERROR for ${client.id}:`, error);
      client.disconnect(true);
    }
  }

  handleDisconnect(client: Socket, reason?: string): void {
    console.log(`[RealtimeGateway] DISCONNECTED: ${client.id}${reason ? ` Reason: ${reason}` : ''}`);
    client.leave('admin_broadcast');
  }

  emitCustom(event: string, payload: any): void {
    console.log(`[RealtimeGateway] EMIT_CUSTOM: ${event}`, payload);

    if (!this.server) {
      console.warn('[RealtimeGateway] EMIT_SKIPPED: Socket.IO server is not attached');
      return;
    }

    this.server.to('admin_broadcast').emit(event, payload);
  }

  emitDashboardRefresh(reason: string): void {
    console.log(`[RealtimeGateway] EMIT_DASHBOARD_REFRESH: ${reason}`);

    if (!this.server) {
      console.warn('[RealtimeGateway] EMIT_DASHBOARD_REFRESH_SKIPPED: Socket.IO server is not attached');
      return;
    }

    this.server.to('admin_broadcast').emit('dashboard_refresh', {
      reason,
      timestamp: Date.now(),
    });
  }

  emitFlowRefresh(flow: string): void {
    console.log(`[RealtimeGateway] EMIT_FLOW_REFRESH: ${flow}`);

    if (!this.server) {
      console.warn('[RealtimeGateway] EMIT_FLOW_REFRESH_SKIPPED: Socket.IO server is not attached');
      return;
    }

    this.server.to('admin_broadcast').emit('flow_refresh', {
      flow,
      timestamp: Date.now(),
    });
  }

  emitInventoryRefresh(payload: any): void {
    console.log(`[RealtimeGateway] EMIT_INVENTORY_REFRESH:`, payload);

    if (!this.server) {
      console.warn('[RealtimeGateway] EMIT_INVENTORY_REFRESH_SKIPPED: Socket.IO server is not attached');
      return;
    }

    this.server.to('admin_broadcast').emit('inventory_updated', {
      ...payload,
      timestamp: Date.now(),
    });
  }

  emitInventoryUpdated(payload: any): void {
    console.log(`[RealtimeGateway] EMIT_INVENTORY_UPDATED:`, payload);

    if (!this.server) {
      console.warn('[RealtimeGateway] EMIT_INVENTORY_UPDATED_SKIPPED: Socket.IO server is not attached');
      return;
    }

    this.server.to('admin_broadcast').emit('inventory_updated', {
      ...payload,
      timestamp: Date.now(),
    });
  }

  emitWatchlistUpdated(payload: any): void {
    console.log(`[RealtimeGateway] EMIT_WATCHLIST_UPDATED:`, payload);

    if (!this.server) {
      console.warn('[RealtimeGateway] EMIT_WATCHLIST_UPDATED_SKIPPED: Socket.IO server is not attached');
      return;
    }

    this.server.to('admin_broadcast').emit('watchlist_updated', {
      ...payload,
      timestamp: Date.now(),
    });
  }

  emitWatchlistRefresh(payload: any): void {
    console.log(`[RealtimeGateway] EMIT_WATCHLIST_REFRESH:`, payload);

    if (!this.server) {
      console.warn('[RealtimeGateway] EMIT_WATCHLIST_REFRESH_SKIPPED: Socket.IO server is not attached');
      return;
    }

    this.server.to('admin_broadcast').emit('watchlist_updated', {
      ...payload,
      timestamp: Date.now(),
    });
  }

  emitSaleRegistered(payload: any): void {
    console.log(`[RealtimeGateway] EMIT_SALE_REGISTERED:`, payload);

    if (!this.server) {
      console.warn('[RealtimeGateway] EMIT_SALE_REGISTERED_SKIPPED: Socket.IO server is not attached');
      return;
    }

    this.server.to('admin_broadcast').emit('sale_registered', {
      ...payload,
      timestamp: Date.now(),
    });
  }

  emitOpportunityRefresh(reason: string): void {
    console.log(`[RealtimeGateway] EMIT_OPPORTUNITY_REFRESH: ${reason}`);

    if (!this.server) {
      console.warn('[RealtimeGateway] EMIT_OPPORTUNITY_REFRESH_SKIPPED: Socket.IO server is not attached');
      return;
    }

    this.server.to('admin_broadcast').emit('opportunity_refresh', {
      reason,
      timestamp: Date.now(),
    });
  }

  emitItemRefresh(itemId: string, reason: string): void {
    console.log(`[RealtimeGateway] EMIT_ITEM_REFRESH: ${itemId}, ${reason}`);

    if (!this.server) {
      console.warn('[RealtimeGateway] EMIT_ITEM_REFRESH_SKIPPED: Socket.IO server is not attached');
      return;
    }

    this.server.to('admin_broadcast').emit('item_refresh', {
      itemId,
      reason,
      timestamp: Date.now(),
    });
  }

  emitListingsRefresh(payload: any): void {
    console.log(`[RealtimeGateway] EMIT_LISTINGS_REFRESH:`, payload);

    if (!this.server) {
      console.warn('[RealtimeGateway] EMIT_LISTINGS_REFRESH_SKIPPED: Socket.IO server is not attached');
      return;
    }

    this.server.emit('listings_refresh', {
      ...payload,
      timestamp: Date.now(),
    });
  }
}