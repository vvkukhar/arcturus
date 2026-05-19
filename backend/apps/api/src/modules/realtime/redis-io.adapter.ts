import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { INestApplicationContext, Logger } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';

export class RedisIoAdapter extends IoAdapter {
  private adapterConstructor: any;
  private readonly logger = new Logger(RedisIoAdapter.name);

  constructor(private app: INestApplicationContext) {
    super(app);
  }

  async connectToRedis(): Promise<void> {
    try {
      const redisService = this.app.get(RedisService);
      const pubClient = redisService.getClient();
      const subClient = pubClient.duplicate();

      if (subClient.status === 'wait') {
        await subClient.connect();
      }

      this.adapterConstructor = createAdapter(pubClient, subClient);
    } catch (err: any) {
      this.logger.error(err.message);
    }
  }

  createIOServer(port: number, options?: ServerOptions): any {
    const server = super.createIOServer(port, {
      ...options,
      path: '/socket.io/',
      cors: {
        origin: [
          'https://www.arcturusbuild.com',
          'https://arcturusbuild.com',
          'http://localhost:3000',
          'http://localhost:5173'
        ],
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