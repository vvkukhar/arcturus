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
        this.disconnect();
      } else {
        return this.instance;
      }
    }

    if (this.isConnecting) return this.instance as Socket;
    this.isConnecting = true;
    this.currentToken = token;

    const wsUrl = appConfig.wsBaseUrl;
    const socketPath = '/api/socket.io'; 

    console.group('SOCKET_CONNECTION_ATTEMPT');
    console.log('Target URL:', wsUrl);
    console.log('Path:', socketPath);
    console.log('Token exists:', !!token);
    console.groupEnd();

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
      console.log('%c[SOCKET_CONNECTED]', 'color: #00ff00', this.instance?.id);
    });

    this.instance.on('connect_error', (err) => {
      console.group('%c[SOCKET_CRITICAL_ERROR]', 'color: #ff0000');
      console.error('Message:', err.message);
      console.error('Description:', (err as any).description);
      console.error('Context:', (err as any).context);
      console.groupEnd();
    });

    this.instance.io.on('reconnect_attempt', (count) => {
      console.log(`[SOCKET_RECONNECT] Attempt ${count}`);
    });

    this.isConnecting = false;
    return this.instance;
  }

  public static disconnect(): void {
    if (this.instance) {
      this.instance.disconnect();
      this.instance = null;
      this.currentToken = null;
      this.isConnecting = false;
    }
  }
}

export const getSocket = () => SocketManager.getSocket();
export const disconnectSocket = () => SocketManager.disconnect();