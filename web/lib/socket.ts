import { io, Socket } from 'socket.io-client';
import { appConfig } from '@/lib/config';

class SocketManager {
  private static instance: Socket | null = null;
  private static currentToken: string | null = null;
  private static isConnecting = false;

  private static getToken(): string | null {
    if (typeof window === 'undefined') return null;

    // 🔥 Надійний regex для пошуку токена (якщо кука не HttpOnly)
    const match = document.cookie.match(/(^|;\s*)arcturus_admin_token=([^;]+)/);
    if (match) {
      console.log('[SocketManager] Token source: cookie arcturus_admin_token');
      return decodeURIComponent(match[2]);
    }

    const possibleLocalStorageKeys = [
      'arcturus_admin_token',
      'admin_token',
      'token',
      'accessToken',
      'access_token',
      'authToken',
      'auth_token',
    ];

    for (const key of possibleLocalStorageKeys) {
      const value = window.localStorage.getItem(key);
      if (value) {
        console.log(`[SocketManager] Token source: localStorage ${key}`);
        return value;
      }
    }

    const possibleSessionStorageKeys = [
      'arcturus_admin_token',
      'admin_token',
      'token',
      'accessToken',
      'access_token',
      'authToken',
      'auth_token',
    ];

    for (const key of possibleSessionStorageKeys) {
      const value = window.sessionStorage.getItem(key);
      if (value) {
        console.log(`[SocketManager] Token source: sessionStorage ${key}`);
        return value;
      }
    }

    console.warn('[SocketManager] No token found in JS. If cookie is HttpOnly, browser will send it automatically.');
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

    // 🔥 ШЛЯХ БЕЗ /api/, бо бекенд чекає саме тут
    const socketPath = '/socket.io/';

    console.log('========== SOCKET CONNECTION INIT ==========');
    console.log('Target URL:', wsUrl);
    console.log('Path:', socketPath);
    console.log('Token exists:', !!token);
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
      // Спочатку пробуємо websocket, якщо Nginx ріже - падаємо на polling
      transports: ['websocket', 'polling'], 
      // 🔥 КРИТИЧНО: змушує браузер відправляти HttpOnly куку на бекенд
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
      
      // Fallback на polling, якщо websocket не пробився
      if (this.instance) {
        this.instance.io.opts.transports = ['polling', 'websocket'];
      }
    });

    this.instance.io.on('reconnect_attempt', (count) => {
      console.log(`[SOCKET_EVENT] RECONNECT_ATTEMPT #${count}`);
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