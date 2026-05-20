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
    
    let wsUrl = appConfig.wsBaseUrl;
    try {
      wsUrl = new URL(appConfig.wsBaseUrl).origin;
    } catch (e) {
      wsUrl = wsUrl.replace(/\/api(\/v[0-9]+)?\/?$/, '').replace(/\/$/, '');
    }

    console.log('[SOCKET_DEBUG] Attempting connection to:', wsUrl, 'with path /api/socket.io/');

    this.instance = io(wsUrl, {
      path: '/socket.io/', // 🔥 ТУТ МАЄ БУТИ /api/socket.io/
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
      auth: token ? { token } : undefined,
      transports: ['websocket', 'polling'], // Спочатку пробуємо websocket
      withCredentials: true,
    });

    // 🕵️‍♂️ ДЕБАГ НА КЛІЄНТІ
    this.instance.on('connect', () => console.log('[SOCKET_DEBUG] Connected! ID:', this.instance?.id));
    this.instance.on('connect_error', (err) => {
      console.error('[SOCKET_DEBUG] Connection error:', err.message, err);
      if (this.instance) {
        this.instance.io.opts.transports = ['polling', 'websocket']; // Fallback
      }
    });
    this.instance.on('disconnect', (reason) => console.log('[SOCKET_DEBUG] Disconnected:', reason));

    this.isConnecting = false;
    return this.instance;
  }

  public static disconnect(): void {
    if (this.instance) {
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