import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/services/trading_transaction_service.dart';
import 'package:lego_trading_manager/data/repositories/analytics_repository.dart';
import 'package:lego_trading_manager/data/repositories/dashboard_repository.dart';
import 'package:lego_trading_manager/data/repositories/inventory_repository.dart';
import 'package:lego_trading_manager/data/repositories/market_repository.dart';
import 'package:lego_trading_manager/data/repositories/partout_repository.dart';
import 'package:lego_trading_manager/data/repositories/purchases_repository.dart';
import 'package:lego_trading_manager/data/repositories/sales_repository.dart';
import 'package:lego_trading_manager/data/repositories/watchlist_repository.dart';
import 'package:lego_trading_manager/app/providers/local_datasources_provider.dart';

final inventoryRepositoryProvider = Provider<InventoryRepository>((ref) {
  return InventoryRepository(ref.watch(inventoryLocalDatasourceProvider));
});

final purchasesRepositoryProvider = Provider<PurchasesRepository>((ref) {
  return PurchasesRepository(ref.watch(purchasesLocalDatasourceProvider));
});

final salesRepositoryProvider = Provider<SalesRepository>((ref) {
  return SalesRepository(ref.watch(salesLocalDatasourceProvider));
});

final watchlistRepositoryProvider = Provider<WatchlistRepository>((ref) {
  return WatchlistRepository(ref.watch(watchlistLocalDatasourceProvider));
});

final marketRepositoryProvider = Provider<MarketRepository>((ref) {
  return MarketRepository(ref.watch(marketLocalDatasourceProvider));
});

final partOutRepositoryProvider = Provider<PartOutRepository>((ref) {
  return PartOutRepository(ref.watch(partoutLocalDatasourceProvider));
});

final dashboardRepositoryProvider = Provider<DashboardRepository>((ref) {
  return DashboardRepository(
    inventoryRepository: ref.watch(inventoryRepositoryProvider),
    salesRepository: ref.watch(salesRepositoryProvider),
  );
});

final analyticsRepositoryProvider = Provider<AnalyticsRepository>((ref) {
  return AnalyticsRepository(
    inventoryRepository: ref.watch(inventoryRepositoryProvider),
    salesRepository: ref.watch(salesRepositoryProvider),
  );
});

final tradingTransactionServiceProvider = Provider<TradingTransactionService>((ref) {
  return TradingTransactionService(
    inventoryRepository: ref.read(inventoryRepositoryProvider),
    purchasesRepository: ref.read(purchasesRepositoryProvider),
    salesRepository: ref.read(salesRepositoryProvider),
  );
});