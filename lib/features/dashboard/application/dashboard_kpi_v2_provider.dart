import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/data/repositories/inventory_repository.dart';
import 'package:lego_trading_manager/data/repositories/watchlist_repository.dart';
import 'package:lego_trading_manager/features/dashboard/application/dashboard_kpi_v2_model.dart';
import 'package:lego_trading_manager/features/inventory/application/dead_stock_detector_provider.dart';

final dashboardKpiV2Provider = Provider<List<DashboardKpiV2Model>>((ref) {
  final inventory = InventoryRepository().getAllItems();
  final watchlist = WatchlistRepository().getAll();
  final deadStock = ref.watch(deadStockEntriesProvider);

  final totalCapital = inventory.fold<double>(
    0,
    (sum, item) => sum + item.totalCost,
  );

  final expectedProfit = inventory.fold<double>(
    0,
    (sum, item) => sum + ((item.expectedSalePrice ?? 0) - item.totalCost),
  );

  final trackedCount = inventory.where((e) => e.isTracked).length;

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
