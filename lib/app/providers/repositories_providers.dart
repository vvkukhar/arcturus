// lib/app/providers/repositories_providers.dart

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

final inventoryRepositoryProvider = Provider<InventoryRepository>((ref) {
  return InventoryRepository();
});

final purchasesRepositoryProvider = Provider<PurchasesRepository>((ref) {
  return PurchasesRepository();
});

final salesRepositoryProvider = Provider<SalesRepository>((ref) {
  return SalesRepository();
});

final watchlistRepositoryProvider = Provider<WatchlistRepository>((ref) {
  return WatchlistRepository();
});

final marketRepositoryProvider = Provider<MarketRepository>((ref) {
  return MarketRepository();
});

final partOutRepositoryProvider = Provider<PartOutRepository>((ref) {
  return PartOutRepository();
});

final dashboardRepositoryProvider = Provider<DashboardRepository>((ref) {
  return DashboardRepository();
});

final analyticsRepositoryProvider = Provider<AnalyticsRepository>((ref) {
  return AnalyticsRepository();
});

final tradingTransactionServiceProvider =
    Provider<TradingTransactionService>((ref) {
  return TradingTransactionService(
    inventoryRepository: ref.read(inventoryRepositoryProvider),
    purchasesRepository: ref.read(purchasesRepositoryProvider),
    salesRepository: ref.read(salesRepositoryProvider),
  );
});
