import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { INestApplicationContext, Logger } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';

export class RedisIoAdapter extends IoAdapter {
  private adapterConstructor: any;
  private readonly logger = new Logger('SocketIO_DEBUG');

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
      this.logger.log('Redis adapter connected successfully.');
    } catch (err: any) {
      this.logger.error('Redis adapter connection failed:', err.message);
    }
  }

  createIOServer(port: number, options?: ServerOptions): any {
    this.logger.log(`Attempting to create Socket.IO server on port ${port}...`);
    
    const server = super.createIOServer(port, {
      ...options,
      // 🔥 КРИТИЧНО: Шлях має бути з префіксом /api/
      path: '/api/socket.io/', 
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

    // 🕵️‍♂️ ДЕБАГ: Слухаємо помилки на рівні самого сервера Socket.IO
    server.engine.on('connection_error', (err: any) => {
      this.logger.error(`[ENGINE_ERROR] Code: ${err.code}, Message: ${err.message}, Req: ${err.req?.url}`);
    });

    this.logger.log('Socket.IO server created and listening on /api/socket.io/');
    
    return server;
  }
}