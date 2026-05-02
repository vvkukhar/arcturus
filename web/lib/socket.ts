import { io, Socket } from 'socket.io-client';
import { appConfig } from '@/lib/config';

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    const baseUrl = appConfig.apiBaseUrl.replace(/\/api$/, '');
    socket = io(baseUrl, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
    });
  }

  return socket;
}