import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/enums/item_status.dart';
import 'package:lego_trading_manager/data/repositories/inventory_repository.dart';
import 'package:lego_trading_manager/features/dashboard/application/dashboard_alerts_provider.dart';
import 'package:lego_trading_manager/features/dashboard/application/dashboard_deep_metrics_model.dart';
import 'package:lego_trading_manager/features/dashboard/application/dashboard_providers.dart';

final dashboardDeepMetricsProvider = Provider<DashboardDeepMetricsModel>((ref) {
  final alerts = ref.watch(dashboardAlertsProvider);
  final stale = ref.watch(dashboardStaleInventoryProvider);
  final bestDeals = ref.watch(dashboardBestDealsProvider);
  
  // Примітка: В ідеалі тут має бути доступ до репозиторію через Provider, 
  // але оскільки це синхронне читання з кешу, це допустимо.
  final allItems = InventoryRepository(ref.watch(inventoryLocalDatasourceProvider)).getAllItems();

  double topExpectedProfit = 0;
  for (final item in allItems) {
    final profit = (item.expectedSalePrice ?? 0) - item.totalCost;
    if (profit > topExpectedProfit) {
      topExpectedProfit = profit;
    }
  }

  return DashboardDeepMetricsModel(
    alertsCount: alerts.length,
    staleCount: stale.length,
    bestDealsCount: bestDeals.length,
    topExpectedProfit: topExpectedProfit,
    totalSoldCount: allItems.where((item) => item.status == ItemStatus.sold).length,
    totalActiveCount: allItems.where((item) => item.isActive).length,
  );
});