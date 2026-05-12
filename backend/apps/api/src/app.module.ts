import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import { ScheduleModule } from '@nestjs/schedule';

import { PrismaModule } from './modules/prisma/prisma.module';
import { RedisModule } from './modules/redis/redis.module';
import { AuthModule } from './modules/auth/auth.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { WatchlistModule } from './modules/watchlist/watchlist.module';
import { MarketModule } from './modules/market/market.module';
import { DealDetectionService } from './modules/deals/deal-detection.service';
import { DealsController } from './modules/deals/deals.controller';
import { RepricerService } from './modules/repricer/repricer.service';
import { AiService } from './modules/ai/ai.service';
import { CronService } from './modules/cron/cron.service';
import { PlanningController } from './modules/planning/planning.controller';
import { QueueBoardModule } from './modules/queue/queue-board.module';
import { QueueModule } from './modules/queue/queue.module';
import { PosModule } from './modules/pos/pos.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    PrismaModule,
    RedisModule,
    AuthModule,
    InventoryModule,
    WatchlistModule,
    MarketModule,
    QueueModule,
    QueueBoardModule,
    PosModule,
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        connection: {
          host: configService.get('REDIS_HOST', 'localhost'),
          port: configService.get<number>('REDIS_PORT', 6379),
          password: configService.get('REDIS_PASSWORD'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [DealsController, PlanningController],
  providers: [
    DealDetectionService,
    RepricerService,
    AiService,
    CronService,
  ],
})
export class AppModule {}