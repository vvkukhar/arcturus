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
      return { on: () => {}, off: () => {}, emit: () => {} } as unknown as Socket;
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
    
    // Забираємо trailing slash, якщо є
    const wsUrl = appConfig.wsBaseUrl.replace(/\/$/, '');

    this.instance = io(wsUrl, {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
      auth: token ? { token } : undefined,
      // 🔥 ФІКС СЬОКЕТІВ: Render ВБИВАЄ прямі WSS підключення. Повертаємо polling як запасний варіант
      transports: ['polling', 'websocket'],
      upgrade: true, // Дозволяємо апгрейд з HTTP на WSS
      withCredentials: true, // Треба для роботи polling-запитів
      path: '/socket.io/', // Чітко вказуємо шлях
    });

    this.instance.on('connect_error', (err) => {
      console.warn('[Socket.io] Connection error:', err.message);
    });

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