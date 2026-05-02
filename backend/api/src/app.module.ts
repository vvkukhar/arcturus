import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ActivityModule } from './modules/activity/activity.module';
import { AiModule } from './modules/ai/ai.module';
import { AllocationModule } from './modules/allocation/allocation.module';
import { AuditModule } from './modules/audit/audit.module';
import { AuthModule } from './modules/auth/auth.module';
import { BackupModule } from './modules/backup/backup.module';
import { CollaborationModule } from './modules/collaboration/collaboration.module';
import { CompsModule } from './modules/comps/comps.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { DealsModule } from './modules/deals/deals.module';
import { DecisionEngineModule } from './modules/decision-engine/decision-engine.module';
import { DocsModule } from './modules/docs/docs.module';
import { ExpensesModule } from './modules/expenses/expenses.module';
import { FinanceModule } from './modules/finance/finance.module';
import { FlowsModule } from './modules/flows/flows.module';
import { HealthModule } from './modules/health/health.module';
import { ImportExportModule } from './modules/import-export/import-export.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { ItemsModule } from './modules/items/items.module';
import { MediaModule } from './modules/media/media.module';
import { MetricsModule } from './modules/metrics/metrics.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { OpportunitiesModule } from './modules/opportunities/opportunities.module';
import { OperatorModule } from './modules/operator/operator.module';
import { OrdersModule } from './modules/orders/orders.module';
import { PlanningModule } from './modules/planning/planning.module';
import { PricingModule } from './modules/pricing/pricing.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { ProcurementModule } from './modules/procurement/procurement.module';
import { PublicStoreModule } from './modules/public/public-store.module';
import { QueueModule } from './modules/queue/queue.module';
import { RateLimitModule } from './modules/rate-limit/rate-limit.module';
import { RealtimeModule } from './modules/realtime/realtime.module';
import { ReportsModule } from './modules/reports/reports.module';
import { RepricerModule } from './modules/repricer/repricer.module';
import { ReturnsModule } from './modules/returns/returns.module';
import { SalesModule } from './modules/sales/sales.module';
import { ScannerModule } from './modules/scanner/scanner.module';
import { SourceHealthModule } from './modules/source-health/source-health.module';
import { StrategyModule } from './modules/strategy/strategy.module';
import { SuggestionsModule } from './modules/suggestions/suggestions.module';
import { SyncModule } from './modules/sync/sync.module';
import { WarehouseModule } from './modules/warehouse/warehouse.module';
import { WatchlistModule } from './modules/watchlist/watchlist.module';
import { RequestLoggerMiddleware } from './common/request-logger.middleware';
import { SecurityHeadersMiddleware } from './common/security-headers.middleware';

@Module({
  imports: [
    PrismaModule,
    RealtimeModule,
    RateLimitModule,
    AuthModule,
    HealthModule,
    DocsModule,
    MetricsModule,
    QueueModule,

    ActivityModule,
    AuditModule,
    BackupModule,
    NotificationsModule,
    StrategyModule,

    ItemsModule,
    InventoryModule,
    WatchlistModule,
    WarehouseModule,
    MediaModule,

    ScannerModule,
    SourceHealthModule,
    SyncModule,
    OperatorModule,

    OpportunitiesModule,
    DealsModule,
    PricingModule,
    RepricerModule,
    CompsModule,
    AiModule,
    SuggestionsModule,

    FlowsModule,
    SalesModule,
    OrdersModule,
    ReturnsModule,
    ProcurementModule,
    ExpensesModule,
    ReportsModule,
    FinanceModule,
    DecisionEngineModule,
    ImportExportModule,

    PublicStoreModule,
    CollaborationModule,
    DashboardModule,
    PlanningModule,
    AllocationModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(SecurityHeadersMiddleware, RequestLoggerMiddleware).forRoutes('*');
  }
}