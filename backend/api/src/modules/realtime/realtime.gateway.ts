import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

const corsEnv = process.env.CORS_ORIGINS ?? '';

@WebSocketGateway({
  cors: {
    origin: corsEnv === '*' ? '*' : corsEnv.split(',').map((o) => o.trim()).filter(Boolean),
    credentials: true,
  },
})
export class RealtimeGateway {
  @WebSocketServer()
  server!: Server;

  handleConnection(client: Socket): void {
    client.emit('connected', {
      ok: true,
      socketId: client.id,
      time: new Date().toISOString(),
    });
  }

  @SubscribeMessage('ping')
  ping(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: unknown,
  ): void {
    client.emit('pong', {
      ok: true,
      body,
      time: new Date().toISOString(),
    });
  }

  emitCustom(event: string, payload: unknown): void {
    this.server?.emit(event, payload);
  }

  emitDashboardRefresh(reason: string, payload?: unknown): void {
    this.server?.emit('dashboard_refresh', {
      reason,
      payload,
      time: new Date().toISOString(),
    });
  }

  emitOpportunityRefresh(reason: string, payload?: unknown): void {
    this.server?.emit('opportunities_refresh', {
      reason,
      payload,
      time: new Date().toISOString(),
    });
  }

  emitInventoryRefresh(payload?: unknown): void {
    this.server?.emit('inventory_refresh', {
      payload,
      time: new Date().toISOString(),
    });
  }

  emitInventoryUpdated(payload: unknown): void {
    this.server?.emit('inventory_updated', payload);
    this.emitInventoryRefresh(payload);
  }

  emitWatchlistRefresh(payload?: unknown): void {
    this.server?.emit('watchlist_refresh', {
      payload,
      time: new Date().toISOString(),
    });
  }

  emitWatchlistUpdated(payload: unknown): void {
    this.server?.emit('watchlist_updated', payload);
    this.emitWatchlistRefresh(payload);
  }

  emitSaleRegistered(payload: unknown): void {
    this.server?.emit('sale_registered', payload);
  }

  emitNotification(payload: unknown): void {
    this.server?.emit('notification', payload);
  }

  emitListingsRefresh(payload?: unknown): void {
    this.server?.emit('listings_refresh', {
      payload,
      time: new Date().toISOString(),
    });
  }

  emitFlowRefresh(flow: 'purchase' | 'reprice' | 'review' | 'all'): void {
    this.server?.emit('flow_refresh', {
      flow,
      time: new Date().toISOString(),
    });
  }

  emitItemRefresh(itemId: string, reason: string): void {
    this.server?.emit('item_refresh', {
      itemId,
      reason,
      time: new Date().toISOString(),
    });
  }

  emitSyncRefresh(reason: string, payload?: unknown): void {
    this.server?.emit('sync_refresh', {
      reason,
      payload,
      time: new Date().toISOString(),
    });
  }

  emitSourceHealthRefresh(reason: string, payload?: unknown): void {
    this.server?.emit('source_health_refresh', {
      reason,
      payload,
      time: new Date().toISOString(),
    });
  }
}