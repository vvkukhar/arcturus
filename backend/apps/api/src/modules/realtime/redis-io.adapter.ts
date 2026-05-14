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
      // Отримуємо існуючий екземпляр RedisService, щоб не плодити нові з'єднання
      const redisService = this.app.get(RedisService);
      const pubClient = redisService.getClient();
      
      // Створюємо дублікат для підписок (вимога socket.io-redis)
      const subClient = pubClient.duplicate();

      // Чекаємо, поки саб-клієнт не підключиться (паб-клієнт вже підключений через OnModuleInit)
      // Оскільки ми використовуємо ioredis, duplicate() не потребує явного connect(), 
      // але ми робимо перевірку статусу
      if (subClient.status === 'wait') {
        await subClient.connect();
      }

      this.adapterConstructor = createAdapter(pubClient, subClient);
      this.logger.log('Successfully connected WebSockets to Redis');
    } catch (err: any) {
      this.logger.error(`Failed to connect WebSockets to Redis. Falling back to in-memory adapter. Error: ${err.message}`);
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