import { Server, Socket } from 'socket.io';
import { createServer } from 'http';
import express from 'express';
import { appConfig } from '../lib/config';

let io: Server | null = null;

export function initSocket(server: ReturnType<typeof createServer>) {
  io = new Server(server, {
    cors: { origin: '*' },
  });

  io.on('connection', (socket: Socket) => {
    console.log(`Client connected: ${socket.id}`);

    socket.on('joinRoom', (room: string) => {
      socket.join(room);
      console.log(`${socket.id} joined ${room}`);
    });

    socket.on('message', (data) => {
      io?.to(data.room).emit('message', data.message);
    });

    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });
}

export function getSocket(): Server {
  if (!io) throw new Error('Socket not initialized');
  return io;
}