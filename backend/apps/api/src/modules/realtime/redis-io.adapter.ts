// C:\Users\Vlad\lego_trading_manager\backend\apps\api\src\modules\realtime\redis-io.adapter.ts
import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { INestApplicationContext } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';

export class RedisIoAdapter extends IoAdapter {
  private adapterConstructor: any;

  constructor(private app: INestApplicationContext) {
    super(app);
  }

  async connectToRedis(): Promise<void> {
    try {
      const redisService = this.app.get(RedisService);
      const pubClient = redisService.getClient();
      const subClient = pubClient.duplicate();

      this.adapterConstructor = createAdapter(pubClient, subClient);
    } catch (err: any) {
      console.error('Redis adapter connection failed:', err);
    }
  }

  createIOServer(port: number, options?: ServerOptions): any {
    const server = super.createIOServer(port, {
      ...options,
      path: '/api/socket.io/',
      cors: {
        origin: true,
        credentials: true,
        methods: ['GET', 'POST', 'OPTIONS'],
      },
      allowEIO3: true,
      transports: ['websocket', 'polling'],
    });
    
    if (this.adapterConstructor) {
      server.adapter(this.adapterConstructor);
    }
    
    return server;
  }
}