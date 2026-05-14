import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';
import { INestApplicationContext, Logger } from '@nestjs/common';

export class RedisIoAdapter extends IoAdapter {
  private adapterConstructor: any;
  private readonly logger = new Logger(RedisIoAdapter.name);

  constructor(app: INestApplicationContext) {
    super(app);
  }

  async connectToRedis(): Promise<void> {
    const url = process.env.REDIS_URL?.trim() || `redis://${process.env.REDIS_HOST || '127.0.0.1'}:${process.env.REDIS_PORT || 6379}`;
    
    const pubClient = createClient({
      url,
      password: process.env.REDIS_PASSWORD || undefined,
      socket: { reconnectStrategy: (retries) => Math.min(retries * 50, 2000) }
    });
    
    const subClient = pubClient.duplicate();

    pubClient.on('error', (err) => this.logger.error('Redis PubClient Error', err.message));
    subClient.on('error', (err) => this.logger.error('Redis SubClient Error', err.message));

    try {
      await Promise.all([pubClient.connect(), subClient.connect()]);
      this.adapterConstructor = createAdapter(pubClient, subClient);
    } catch (err: any) {
      this.logger.error(`Failed to connect to Redis. WebSockets will fallback to memory adapter. ${err.message}`);
    }
  }

  createIOServer(port: number, options?: ServerOptions): any {
    const server = super.createIOServer(port, {
      ...options,
      cors: {
        origin: process.env.CORS_ORIGINS?.split(',') || '*',
        credentials: true,
      },
    });
    
    if (this.adapterConstructor) {
      server.adapter(this.adapterConstructor);
    }
    
    return server;
  }
}