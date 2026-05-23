import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

import { PrismaModule } from './modules/prisma/prisma.module';
import { RedisModule } from './modules/redis/redis.module';
import { AuthModule } from './modules/auth/auth.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { WatchlistModule } from './modules/watchlist/watchlist.module';
import { MarketModule } from './modules/market/market.module';
import { DealsModule } from './modules/deals/deals.module';
import { RepricerModule } from './modules/repricer/repricer.module';
import { AiModule } from './modules/ai/ai.module';
import { CronModule } from './modules/cron/cron.module';
import { PlanningModule } from './modules/planning/planning.module';
import { QueueBoardModule } from './modules/queue/queue-board.module';
import { QueueModule } from './modules/queue/queue.module';
import { PosModule } from './modules/pos/pos.module';
import { RateLimitModule } from './modules/rate-limit/rate-limit.module';
import { ActivityModule } from './modules/activity/activity.module';
import { AuditModule } from './modules/audit/audit.module';
import { BackupModule } from './modules/backup/backup.module';
import { CapitalModule } from './modules/capital/capital.module';
import { CollaborationModule } from './modules/collaboration/collaboration.module';
import { CompsModule } from './modules/comps/comps.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { DecisionEngineModule } from './modules/decision-engine/decision-engine.module';
import { DecisionsModule } from './modules/decisions/decisions.module';
import { DocsModule } from './modules/docs/docs.module';
import { ExpensesModule } from './modules/expenses/expenses.module';
import { FinanceModule } from './modules/finance/finance.module';
import { FlowsModule } from './modules/flows/flows.module';
import { HealthModule } from './modules/health/health.module';
import { ImportExportModule } from './modules/import-export/import-export.module';
import { InsightsModule } from './modules/insights/insights.module';
import { ItemsModule } from './modules/items/items.module';
import { MetricsModule } from './modules/metrics/metrics.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { OperatorModule } from './modules/operator/operator.module';
import { OpportunitiesModule } from './modules/opportunities/opportunities.module';
import { OpportunityEngineModule } from './modules/opportunity-engine/opportunity-engine.module';
import { OrdersModule } from './modules/orders/orders.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { PortfolioModule } from './modules/portfolio/portfolio.module';
import { PricingModule } from './modules/pricing/pricing.module';
import { ProcurementModule } from './modules/procurement/procurement.module';
import { ProfitModule } from './modules/profit/profit.module';
import { PublicStoreModule } from './modules/public/public-store.module';
import { PublicModule } from './modules/public/public.module';
import { RealtimeModule } from './modules/realtime/realtime.module';
import { ReportsModule } from './modules/reports/reports.module';
import { ReturnsModule } from './modules/returns/returns.module';
import { SalesModule } from './modules/sales/sales.module';
import { ScannerModule } from './modules/scanner/scanner.module';
import { ShippingModule } from './modules/shipping/shipping.module';
import { SourceHealthModule } from './modules/source-health/source-health.module';
import { StrategyModule } from './modules/strategy/strategy.module';
import { SuggestionsModule } from './modules/suggestions/suggestions.module';
import { SyncModule } from './modules/sync/sync.module';
import { UsersModule } from './modules/users/users.module';
import { WarehouseModule } from './modules/warehouse/warehouse.module';
import { MediaModule } from './modules/media/media.module';

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
    DealsModule,
    RepricerModule,
    AiModule,
    CronModule,
    PlanningModule,
    QueueModule,
    QueueBoardModule,
    PosModule,
    RateLimitModule,
    ActivityModule,
    AuditModule,
    BackupModule,
    CapitalModule,
    CollaborationModule,
    CompsModule,
    DashboardModule,
    DecisionEngineModule,
    DecisionsModule,
    DocsModule,
    ExpensesModule,
    FinanceModule,
    FlowsModule,
    HealthModule,
    ImportExportModule,
    InsightsModule,
    ItemsModule,
    MetricsModule,
    NotificationsModule,
    OperatorModule,
    OpportunitiesModule,
    OpportunityEngineModule,
    OrdersModule,
    PaymentsModule,
    PortfolioModule,
    PricingModule,
    ProcurementModule,
    ProfitModule,
    PublicStoreModule,
    PublicModule,
    RealtimeModule,
    ReportsModule,
    ReturnsModule,
    SalesModule,
    ScannerModule,
    ShippingModule,
    SourceHealthModule,
    StrategyModule,
    SuggestionsModule,
    SyncModule,
    UsersModule,
    WarehouseModule,
    MediaModule 
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}