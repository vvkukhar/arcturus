import { io, Socket } from 'socket.io-client';
import { appConfig } from '@/lib/config';

class SocketManager {
  private static instance: Socket | null = null;
  private static currentToken: string | null = null;
  private static isConnecting = false;

  private static getCookie(name: string): string | null {
    if (typeof document === 'undefined') return null;
    const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
    return match ? decodeURIComponent(match[2]) : null;
  }

  public static getSocket(): Socket {
    if (typeof window === 'undefined') {
      return { on: () => {}, off: () => {}, emit: () => {}, disconnect: () => {} } as unknown as Socket;
    }

    const token = this.getCookie('arcturus_admin_token');

    if (this.instance) {
      if (token !== this.currentToken) {
        console.log('[SocketManager] Token changed, disconnecting current instance.');
        this.disconnect();
      } else {
        return this.instance;
      }
    }

    if (this.isConnecting) {
      console.log('[SocketManager] Connection already in progress, returning existing instance.');
      return this.instance as Socket;
    }
    
    this.isConnecting = true;
    this.currentToken = token;
    
    const wsUrl = appConfig.wsBaseUrl.replace(/\/api(\/v[0-9]+)?\/?$/, '').replace(/\/$/, '');
    const socketPath = '/socket.io/';

    console.log('========== SOCKET CONNECTION INIT ==========');
    console.log('Target URL:', wsUrl);
    console.log('Path:', socketPath);
    console.log('Token exists:', !!token);
    console.log('Token length:', token ? token.length : 0);
    console.log('============================================');

    this.instance = io(wsUrl, {
      path: socketPath,
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 30000,
      auth: token ? { token } : undefined,
      transports: ['websocket', 'polling'],
      withCredentials: true,
      forceNew: true,
    });

    this.instance.on('connect', () => {
      console.log('[SOCKET_EVENT] CONNECTED. ID:', this.instance?.id);
    });

    this.instance.on('disconnect', (reason) => {
      console.warn('[SOCKET_EVENT] DISCONNECTED. Reason:', reason);
    });

    this.instance.on('connect_error', (err) => {
      console.error('========== SOCKET CRITICAL ERROR ==========');
      console.error('Message:', err.message);
      console.error('Stack:', err.stack);
      console.error('Description:', (err as any).description);
      console.error('Context:', (err as any).context);
      console.error('===========================================');
      
      if (this.instance) {
        console.log('[SOCKET_EVENT] Forcing fallback to polling and websocket');
        this.instance.io.opts.transports = ['polling', 'websocket'];
      }
    });

    this.instance.io.on('reconnect_attempt', (count) => {
      console.log(`[SOCKET_EVENT] RECONNECT_ATTEMPT #${count}`);
    });

    this.instance.io.on('reconnect_error', (error) => {
      console.error(`[SOCKET_EVENT] RECONNECT_ERROR:`, error);
    });

    this.instance.io.on('reconnect_failed', () => {
      console.error(`[SOCKET_EVENT] RECONNECT_FAILED - Max attempts reached`);
    });

    this.instance.io.on('ping', () => {
      console.debug(`[SOCKET_EVENT] PING`);
    });

    this.instance.io.on('packet', (packet) => {
      console.debug(`[SOCKET_EVENT] PACKET_RECEIVED:`, packet);
    });

    this.isConnecting = false;
    return this.instance;
  }

  public static disconnect(): void {
    if (this.instance) {
      console.log('[SocketManager] Disconnecting socket instance intentionally.');
      this.instance.removeAllListeners();
      this.instance.disconnect();
      this.instance = null;
      this.currentToken = null;
      this.isConnecting = false;
    }
  }
}

export const getSocket = () => SocketManager.getSocket();
export const disconnectSocket = () => SocketManager.disconnect();