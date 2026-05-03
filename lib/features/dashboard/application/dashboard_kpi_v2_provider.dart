import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/app/providers/repositories_providers.dart';
import 'package:lego_trading_manager/features/dashboard/application/dashboard_kpi_v2_model.dart';
import 'package:lego_trading_manager/features/inventory/application/dead_stock_detector_provider.dart';

final dashboardKpiV2Provider = Provider<List<DashboardKpiV2Model>>((ref) {
  final inventory = ref.watch(inventoryRepositoryProvider).getAllItems();
  final watchlist = ref.watch(watchlistRepositoryProvider).getAll();
  final deadStock = ref.watch(deadStockEntriesProvider);

  double totalCapital = 0;
  double expectedProfit = 0;
  int trackedCount = 0;

  for (final item in inventory) {
    totalCapital += item.totalCost;
    expectedProfit += ((item.expectedSalePrice ?? 0) - item.totalCost);
    if (item.isTracked) trackedCount++;
  }

  return [
    DashboardKpiV2Model(
      title: 'Total Capital',
      value: totalCapital.toStringAsFixed(0),
      subtitle: 'capital inside inventory',
    ),
    DashboardKpiV2Model(
      title: 'Expected Profit',
      value: expectedProfit.toStringAsFixed(0),
      subtitle: 'if active items are sold',
    ),
    DashboardKpiV2Model(
      title: 'Dead Stock',
      value: deadStock.length.toString(),
      subtitle: 'aging items needing action',
    ),
    DashboardKpiV2Model(
      title: 'Tracked Items',
      value: trackedCount.toString(),
      subtitle: 'actively monitored inventory',
    ),
    DashboardKpiV2Model(
      title: 'Watchlist',
      value: watchlist.length.toString(),
      subtitle: 'active target buys',
    ),
  ];
});