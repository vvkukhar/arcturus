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
  path: '/socket.io/',
  cors: {
    origin: [
      'https://www.arcturusbuild.com',
      'https://arcturusbuild.com',
      'http://localhost:3000',
      'http://localhost:5173'
    ],
    credentials: true,
  },
  transports: ['websocket', 'polling'],
  allowEIO3: true,
})
export class RealtimeGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  constructor(private readonly prisma: PrismaService) {}

  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  async handleConnection(client: Socket) {
    try {
      const rawToken = client.handshake.auth?.token || client.handshake.headers?.authorization;
      
      if (!rawToken) {
        client.disconnect(true);
        return;
      }

      const cleanToken = rawToken.replace('Bearer ', '');
      const tokenHash = this.hashToken(cleanToken);
      
      const session = await this.prisma.userSession.findUnique({
        where: { tokenHash },
        include: { user: true },
      });

      if (!session || !(session as any).user?.active || (session.expiresAt && session.expiresAt.getTime() < Date.now())) {
        client.disconnect(true);
        return;
      }

      client.join('admin_broadcast');
    } catch (error) {
      client.disconnect(true);
    }
  }

  handleDisconnect(client: Socket) {
    client.leave('admin_broadcast');
  }

  emitCustom(event: string, payload: any) {
    if (!this.server) return;
    this.server.to('admin_broadcast').emit(event, payload);
  }

  emitDashboardRefresh(reason: string) {
    if (!this.server) return;
    this.server.to('admin_broadcast').emit('dashboard_refresh', { reason, timestamp: Date.now() });
  }

  emitFlowRefresh(flow: string) {
    if (!this.server) return;
    this.server.to('admin_broadcast').emit('flow_refresh', { flow, timestamp: Date.now() });
  }

  emitInventoryRefresh(payload: any) {
    if (!this.server) return;
    this.server.to('admin_broadcast').emit('inventory_updated', { ...payload, timestamp: Date.now() });
  }

  emitInventoryUpdated(payload: any) {
    if (!this.server) return;
    this.server.to('admin_broadcast').emit('inventory_updated', { ...payload, timestamp: Date.now() });
  }

  emitWatchlistUpdated(payload: any) {
    if (!this.server) return;
    this.server.to('admin_broadcast').emit('watchlist_updated', { ...payload, timestamp: Date.now() });
  }

  emitWatchlistRefresh(payload: any) {
    if (!this.server) return;
    this.server.to('admin_broadcast').emit('watchlist_updated', { ...payload, timestamp: Date.now() });
  }

  emitSaleRegistered(payload: any) {
    if (!this.server) return;
    this.server.to('admin_broadcast').emit('sale_registered', { ...payload, timestamp: Date.now() });
  }

  emitOpportunityRefresh(reason: string) {
    if (!this.server) return;
    this.server.to('admin_broadcast').emit('opportunity_refresh', { reason, timestamp: Date.now() });
  }

  emitItemRefresh(itemId: string, reason: string) {
    if (!this.server) return;
    this.server.to('admin_broadcast').emit('item_refresh', { itemId, reason, timestamp: Date.now() });
  }

  emitListingsRefresh(payload: any) {
    if (!this.server) return;
    this.server.emit('listings_refresh', { ...payload, timestamp: Date.now() });
  }
}