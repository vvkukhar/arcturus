import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PrismaService } from '../prisma/prisma.service';
import * as crypto from 'crypto';

@WebSocketGateway({
  path: '/api/socket.io/',
  cors: {
    origin: true,
    credentials: true,
  },
  transports: ['websocket', 'polling'],
  allowEIO3: true,
})
export class RealtimeGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  constructor(private readonly prisma: PrismaService) {
    console.log('[RealtimeGateway] INITIALIZED');
  }

  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  async handleConnection(client: Socket) {
    console.log(`[RealtimeGateway] CONNECTION_ATTEMPT: ${client.id}`);
    console.log(`[RealtimeGateway] HEADERS:`, JSON.stringify(client.handshake.headers));
    console.log(`[RealtimeGateway] AUTH:`, JSON.stringify(client.handshake.auth));
    console.log(`[RealtimeGateway] QUERY:`, JSON.stringify(client.handshake.query));

    try {
      const rawToken = client.handshake.auth?.token || client.handshake.headers?.authorization;
      
      if (!rawToken) {
        console.error(`[RealtimeGateway] CONNECTION_REJECTED: No token provided for ${client.id}`);
        client.disconnect(true);
        return;
      }

      const cleanToken = rawToken.replace('Bearer ', '');
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

      console.log(`[RealtimeGateway] CONNECTION_SUCCESS: User ${(session as any).user.email} joined admin_broadcast (${client.id})`);
      client.join('admin_broadcast');
    } catch (error) {
      console.error(`[RealtimeGateway] CONNECTION_ERROR for ${client.id}:`, error);
      client.disconnect(true);
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`[RealtimeGateway] DISCONNECTED: ${client.id}`);
    client.leave('admin_broadcast');
  }

  emitCustom(event: string, payload: any) {
    console.log(`[RealtimeGateway] EMIT_CUSTOM: ${event}`, payload);
    if (!this.server) return;
    this.server.to('admin_broadcast').emit(event, payload);
  }

  emitDashboardRefresh(reason: string) {
    console.log(`[RealtimeGateway] EMIT_DASHBOARD_REFRESH: ${reason}`);
    if (!this.server) return;
    this.server.to('admin_broadcast').emit('dashboard_refresh', { reason, timestamp: Date.now() });
  }

  emitFlowRefresh(flow: string) {
    console.log(`[RealtimeGateway] EMIT_FLOW_REFRESH: ${flow}`);
    if (!this.server) return;
    this.server.to('admin_broadcast').emit('flow_refresh', { flow, timestamp: Date.now() });
  }

  emitInventoryRefresh(payload: any) {
    console.log(`[RealtimeGateway] EMIT_INVENTORY_REFRESH:`, payload);
    if (!this.server) return;
    this.server.to('admin_broadcast').emit('inventory_updated', { ...payload, timestamp: Date.now() });
  }

  emitInventoryUpdated(payload: any) {
    console.log(`[RealtimeGateway] EMIT_INVENTORY_UPDATED:`, payload);
    if (!this.server) return;
    this.server.to('admin_broadcast').emit('inventory_updated', { ...payload, timestamp: Date.now() });
  }

  emitWatchlistUpdated(payload: any) {
    console.log(`[RealtimeGateway] EMIT_WATCHLIST_UPDATED:`, payload);
    if (!this.server) return;
    this.server.to('admin_broadcast').emit('watchlist_updated', { ...payload, timestamp: Date.now() });
  }

  emitWatchlistRefresh(payload: any) {
    console.log(`[RealtimeGateway] EMIT_WATCHLIST_REFRESH:`, payload);
    if (!this.server) return;
    this.server.to('admin_broadcast').emit('watchlist_updated', { ...payload, timestamp: Date.now() });
  }

  emitSaleRegistered(payload: any) {
    console.log(`[RealtimeGateway] EMIT_SALE_REGISTERED:`, payload);
    if (!this.server) return;
    this.server.to('admin_broadcast').emit('sale_registered', { ...payload, timestamp: Date.now() });
  }

  emitOpportunityRefresh(reason: string) {
    console.log(`[RealtimeGateway] EMIT_OPPORTUNITY_REFRESH: ${reason}`);
    if (!this.server) return;
    this.server.to('admin_broadcast').emit('opportunity_refresh', { reason, timestamp: Date.now() });
  }

  emitItemRefresh(itemId: string, reason: string) {
    console.log(`[RealtimeGateway] EMIT_ITEM_REFRESH: ${itemId}, ${reason}`);
    if (!this.server) return;
    this.server.to('admin_broadcast').emit('item_refresh', { itemId, reason, timestamp: Date.now() });
  }

  emitListingsRefresh(payload: any) {
    console.log(`[RealtimeGateway] EMIT_LISTINGS_REFRESH:`, payload);
    if (!this.server) return;
    this.server.emit('listings_refresh', { ...payload, timestamp: Date.now() });
  }
}