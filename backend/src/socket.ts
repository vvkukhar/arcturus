import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import { appConfig } from './config';

let io: Server | null = null;

export function initSocket(server: HttpServer) {
  if (io) return io;

  io = new Server(server, {
    cors: {
      origin: '*',
    },
  });

  io.on('connection', (socket: Socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });

  return io;
}

export function getSocket(): Server {
  if (!io) throw new Error('Socket.io not initialized');
  return io;
}