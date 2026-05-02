import { Server, Socket } from 'socket.io';
import { createServer } from 'http';
import express from 'express';
import { SuggestionItem } from '../suggestions/suggestions.service';

export class SocketService {
  public io: Server | null = null;

  constructor(private app = express()) {}

  init(httpServer: ReturnType<typeof createServer>) {
    this.io = new Server(httpServer, {
      cors: { origin: '*' },
      transports: ['websocket', 'polling'],
    });

    this.io.on('connection', (socket: Socket) => {
      console.log(`Socket connected: ${socket.id}`);

      socket.on('subscribeSuggestions', () => {
        console.log('Client subscribed to suggestions');
      });
    });
  }

  emitSuggestionsUpdate(suggestions: SuggestionItem[]) {
    if (this.io) {
      this.io.emit('suggestionsUpdate', suggestions);
    }
  }
}