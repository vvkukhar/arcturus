import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { INestApplicationContext } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';

export class RedisIoAdapter extends IoAdapter {
  private adapterConstructor: any;

  constructor(private app: INestApplicationContext) {
    super(app);
    console.log('[RedisIoAdapter] INSTANTIATED');
  }

  async connectToRedis(): Promise<void> {
    console.log('[RedisIoAdapter] CONNECTING_TO_REDIS');
    try {
      const redisService = this.app.get(RedisService);
      const pubClient = redisService.getClient();
      const subClient = pubClient.duplicate();

      this.adapterConstructor = createAdapter(pubClient, subClient);
      console.log('[RedisIoAdapter] REDIS_ADAPTER_CREATED_SUCCESSFULLY');
    } catch (err: any) {
      console.error('[RedisIoAdapter] REDIS_CONNECTION_FAILED:', err);
    }
  }

  createIOServer(port: number, options?: ServerOptions): any {
    console.log(`[RedisIoAdapter] CREATING_IO_SERVER on port: ${port}`);
    console.log(`[RedisIoAdapter] IO_SERVER_OPTIONS:`, JSON.stringify(options));
    
    const server = super.createIOServer(port, {
      ...options,
      path: '/socket.io/',
      cors: {
        origin: true,
        credentials: true,
        methods: ['GET', 'POST', 'OPTIONS'],
      },
      allowEIO3: true,
      transports: ['websocket', 'polling'],
    });
    
    if (this.adapterConstructor) {
      console.log('[RedisIoAdapter] ATTACHING_REDIS_ADAPTER_TO_SERVER');
      server.adapter(this.adapterConstructor);
    } else {
      console.warn('[RedisIoAdapter] NO_REDIS_ADAPTER_CONSTRUCTOR_FOUND');
    }
    
    return server;
  }
}