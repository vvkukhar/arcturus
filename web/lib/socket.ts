import { io, Socket } from 'socket.io-client';
import { appConfig } from '@/lib/config';

class SocketManager {
  private static instance: Socket | null = null;
  private static currentToken: string | null = null;
  private static reconnectTimer: NodeJS.Timeout | null = null;

  private static getCookie(name: string): string | null {
    if (typeof document === 'undefined') return null;
    const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
    return match ? decodeURIComponent(match[2]) : null;
  }

  public static getSocket(): Socket {
    const token = this.getCookie('arcturus_admin_token');

    if (this.instance) {
      if (token !== this.currentToken) {
        this.disconnect();
      } else {
        return this.instance;
      }
    }

    this.currentToken = token;
    const baseUrl = appConfig.apiBaseUrl.replace(/\/api\/?$/, '');

    this.instance = io(baseUrl, {
      transports: ['websocket'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 10000,
      auth: token ? { token } : undefined,
    });

    this.instance.on('disconnect', (reason) => {
      if (reason === 'io server disconnect' || reason === 'io client disconnect') {
        if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
        this.reconnectTimer = setTimeout(() => {
          if (this.instance && !this.instance.connected) {
            this.instance.connect();
          }
        }, 2000);
      }
    });

    return this.instance;
  }

  public static disconnect(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.instance) {
      this.instance.removeAllListeners();
      this.instance.disconnect();
      this.instance = null;
      this.currentToken = null;
    }
  }
}

export const getSocket = () => SocketManager.getSocket();
export const disconnectSocket = () => SocketManager.disconnect();