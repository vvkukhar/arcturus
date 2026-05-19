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
      this.logger.log('Successfully connected WebSockets to Redis');
    } catch (err: any) {
      this.logger.error(`Failed to connect WebSockets to Redis: ${err.message}`);
    }
  }

  createIOServer(port: number, options?: ServerOptions): any {
    const server = super.createIOServer(port, {
      ...options,
      cors: {
        origin: [
          'https://www.arcturusbuild.com', 
          'https://arcturusbuild.com', 
          'http://localhost:3000'
        ],
        credentials: true,
        methods: ['GET', 'POST'],
      },
      allowEIO3: true,
      path: '/socket.io/', // Абсолютно чистий шлях без /api
    });
    
    if (this.adapterConstructor) {
      server.adapter(this.adapterConstructor);
    }
    
    return server;
  }
}