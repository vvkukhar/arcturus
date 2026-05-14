import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { ExpressAdapter } from '@bull-board/express';
import { Queue } from 'bullmq';
import Redis from 'ioredis';
import { QUEUE_NAMES } from './queue.constants';
import { NextFunction, Request, Response } from 'express';

@Module({})
export class QueueBoardModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    const serverAdapter = new ExpressAdapter();
    serverAdapter.setBasePath('/api/admin/queues');

    const redisUrl = process.env.REDIS_URL?.trim();
    const options = { maxRetriesPerRequest: null, enableReadyCheck: false };
    
    const connection = redisUrl 
      ? new Redis(redisUrl, options) 
      : new Redis({
          host: process.env.REDIS_HOST || '127.0.0.1',
          port: Number(process.env.REDIS_PORT || 6379),
          password: process.env.REDIS_PASSWORD || undefined,
          ...options,
        });

    const queues = Object.values(QUEUE_NAMES).map(
      (name) => new BullMQAdapter(new Queue(name, { connection })) as any
    );

    createBullBoard({
      queues,
      serverAdapter,
      options: {
        uiConfig: {
          boardTitle: 'Arcturus Queue Matrix',
          miscLinks: [{ text: 'Back to API', url: '/api/health' }],
        },
      },
    });

    consumer
      .apply((req: Request, res: Response, next: NextFunction) => {
        const token = req.query.token || req.headers['authorization']?.split(' ')[1];
        const adminToken = process.env.ADMIN_TOKEN;
        
        if (token === adminToken && adminToken) {
          return next();
        }
        res.status(401).json({ error: 'Unauthorized Queue Access' });
      }, serverAdapter.getRouter())
      .forRoutes('/admin/queues');
  }
}