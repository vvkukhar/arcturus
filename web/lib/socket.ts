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

    const socketPath = '/socket.io/';

    console.group('%c[SOCKET_INIT_TRACE]', 'color: #00ff00; font-weight: bold; font-size: 14px;');
    console.log('WS_URL:', wsUrl);
    console.log('PATH:', socketPath);
    console.log('TOKEN_PRESENT:', !!token);
    console.log('TRANSPORTS_CONFIGURED:', ['websocket', 'polling']);
    console.log('WINDOW_LOCATION:', window.location.href);
    console.groupEnd();

    this.instance = io(wsUrl, {
      path: socketPath,
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 20,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 30000,
      auth: token ? { token } : undefined,
      transports: ['websocket', 'polling'],
      withCredentials: true,
      forceNew: true,
    });

    this.instance.on('connect', () => {
      console.group('%c[SOCKET_CONNECTED]', 'color: #00ff00; font-weight: bold; font-size: 14px;');
      console.log('SOCKET_ID:', this.instance?.id);
      console.log('CONNECTED:', this.instance?.connected);
      console.log('ACTIVE_TRANSPORT:', this.instance?.io.engine.transport.name);
      console.groupEnd();
    });

    this.instance.on('connect_error', (err) => {
      console.group('%c[SOCKET_CONNECT_ERROR_CRITICAL]', 'color: #ff0000; font-weight: bold; font-size: 14px;');
      console.error('ERROR_NAME:', err.name);
      console.error('ERROR_MESSAGE:', err.message);
      console.error('ERROR_STACK:', err.stack);
      console.dir(err);
      console.log('CURRENT_TRANSPORT:', this.instance?.io.engine.transport.name);
      console.groupEnd();

      if (this.instance) {
        this.instance.io.opts.transports = ['polling', 'websocket'];
      }
    });

    this.instance.on('disconnect', (reason, details) => {
      console.group('%c[SOCKET_DISCONNECTED]', 'color: #ffaa00; font-weight: bold; font-size: 14px;');
      console.warn('REASON:', reason);
      console.warn('DETAILS:', details);
      console.groupEnd();
    });

    this.instance.on('reconnect_attempt', (attempt) => {
      console.log('%c[SOCKET_RECONNECT_ATTEMPT]', 'color: #00aaff; font-weight: bold;', 'Attempt:', attempt);
    });

    this.instance.on('reconnect_error', (err) => {
      console.error('%c[SOCKET_RECONNECT_ERROR]', 'color: #ff0000; font-weight: bold;', err.message);
    });

    this.instance.on('reconnect_failed', () => {
      console.error('%c[SOCKET_RECONNECT_FAILED]', 'color: #ff0000; font-weight: bold;', 'Max attempts reached.');
    });

    this.instance.io.engine.on('upgrade', (transport) => {
      console.log('%c[SOCKET_ENGINE_UPGRADE]', 'color: #00ff00; font-weight: bold;', 'Upgraded to:', transport.name);
    });

    this.instance.io.engine.on('upgradeError', (err) => {
      console.error('%c[SOCKET_ENGINE_UPGRADE_ERROR]', 'color: #ff0000; font-weight: bold;', err);
    });

    this.instance.io.engine.on('packet', (packet) => {
      console.log('%c[SOCKET_ENGINE_PACKET_RX]', 'color: #aaffaa;', packet.type, packet.data);
    });

    this.instance.io.engine.on('packetCreate', (packet) => {
      console.log('%c[SOCKET_ENGINE_PACKET_TX]', 'color: #ffaaaa;', packet.type, packet.data);
    });

    this.instance.io.engine.on('close', (reason, desc) => {
      console.warn('%c[SOCKET_ENGINE_CLOSE]', 'color: #ffaa00; font-weight: bold;', 'Reason:', reason, 'Desc:', desc);
    });

    this.isConnecting = false;
    return this.instance;
  }

  public static disconnect(): void {
    if (this.instance) {
      console.log('%c[SOCKET_MANUAL_DISCONNECT]', 'color: #ff0000; font-weight: bold;', 'Triggered');
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