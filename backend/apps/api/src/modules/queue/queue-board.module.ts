import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { ExpressAdapter } from '@bull-board/express';
import { Queue } from 'bullmq';
import { RedisService } from '../redis/redis.service';
import { QUEUE_NAMES } from './queue.constants';
import { NextFunction, Request, Response } from 'express';

@Module({})
export class QueueBoardModule implements NestModule {
  constructor(private readonly redisService: RedisService) {}

  configure(consumer: MiddlewareConsumer) {
    const serverAdapter = new ExpressAdapter();
    serverAdapter.setBasePath('/api/admin/queues');

    const connection = this.redisService.getClient();

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
        const b64auth = (req.headers.authorization || '').split(' ')[1] || '';
        const [login, password] = Buffer.from(b64auth, 'base64').toString().split(':');
        const expectedPassword = process.env.ADMIN_TOKEN;
        
        if (login === 'admin' && password === expectedPassword && expectedPassword) {
          return next();
        }

        res.set('WWW-Authenticate', 'Basic realm="Arcturus Secure Area"');
        res.status(401).send('Authentication required.');
      }, serverAdapter.getRouter())
      .forRoutes('/admin/queues');
  }
}