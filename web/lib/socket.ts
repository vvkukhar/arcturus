import { io, Socket } from 'socket.io-client';
import { appConfig } from '@/lib/config';

class SocketManager {
  private static instance: Socket | null = null;
  private static currentToken: string | null = null;
  private static isConnecting = false;

  private static getCookie(name: string): string | null {
    if (typeof document === 'undefined') return null;

    const cookies = document.cookie
      .split(';')
      .map((cookie) => cookie.trim());

    for (const cookie of cookies) {
      if (cookie.startsWith(`${name}=`)) {
        return decodeURIComponent(cookie.substring(name.length + 1));
      }
    }

    return null;
  }

  private static getToken(): string | null {
    if (typeof window === 'undefined') return null;

    const cookieToken = this.getCookie('arcturus_admin_token');

    if (cookieToken) {
      console.log('[SocketManager] Token source: cookie');
      return cookieToken;
    }

    const localStorageToken =
      window.localStorage.getItem('arcturus_admin_token') ||
      window.localStorage.getItem('admin_token') ||
      window.localStorage.getItem('token') ||
      window.localStorage.getItem('accessToken');

    if (localStorageToken) {
      console.log('[SocketManager] Token source: localStorage');
      return localStorageToken;
    }

    const sessionStorageToken =
      window.sessionStorage.getItem('arcturus_admin_token') ||
      window.sessionStorage.getItem('admin_token') ||
      window.sessionStorage.getItem('token') ||
      window.sessionStorage.getItem('accessToken');

    if (sessionStorageToken) {
      console.log('[SocketManager] Token source: sessionStorage');
      return sessionStorageToken;
    }

    console.warn('[SocketManager] No token found in cookie/localStorage/sessionStorage');
    return null;
  }

  public static getSocket(): Socket {
    if (typeof window === 'undefined') {
      return {
        on: () => {},
        off: () => {},
        emit: () => {},
        disconnect: () => {},
      } as unknown as Socket;
    }

    const token = this.getToken();

    if (this.instance) {
      if (token !== this.currentToken) {
        console.log('[SocketManager] Token changed, disconnecting current instance.');
        this.disconnect();
      } else {
        return this.instance;
      }
    }

    if (this.isConnecting && this.instance) {
      console.log('[SocketManager] Connection already in progress, returning existing instance.');
      return this.instance;
    }

    this.isConnecting = true;
    this.currentToken = token;

    const wsUrl = appConfig.wsBaseUrl
      .replace(/\/api(\/v[0-9]+)?\/?$/, '')
      .replace(/\/$/, '');

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
      auth: token ? { token } : {},
      query: token ? { token } : {},
      transports: ['websocket', 'polling'],
      withCredentials: true,
      forceNew: true,
    });

    this.instance.on('connect', () => {
      this.isConnecting = false;
      console.log('[SOCKET_EVENT] CONNECTED. ID:', this.instance?.id);
    });

    this.instance.on('socket_ready', (payload) => {
      console.log('[SOCKET_EVENT] SOCKET_READY:', payload);
    });

    this.instance.on('disconnect', (reason) => {
      this.isConnecting = false;
      console.warn('[SOCKET_EVENT] DISCONNECTED. Reason:', reason);
    });

    this.instance.on('connect_error', (err) => {
      this.isConnecting = false;

      console.error('========== SOCKET CRITICAL ERROR ==========');
      console.error('Message:', err.message);
      console.error('Stack:', err.stack);
      console.error('Description:', (err as any).description);
      console.error('Context:', (err as any).context);
      console.error('===========================================');
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