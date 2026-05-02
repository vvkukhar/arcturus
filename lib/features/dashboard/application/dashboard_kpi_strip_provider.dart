import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/data/repositories/inventory_repository.dart';
import 'package:lego_trading_manager/features/dashboard/application/dashboard_kpi_strip_model.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_opportunities_provider.dart';

final dashboardKpiStripProvider = Provider<DashboardKpiStripModel>((ref) {
  final inventory = InventoryRepository().getAllItems();
  final opportunities = ref.watch(watchlistOpportunitiesProvider);

  final activeItems = inventory.where((item) => item.isActive).toList();

  final liquidationPotential = activeItems.fold<double>(
    0,
    (sum, item) => sum + (item.marketAverage ?? 0),
  );

  final expectedOpenProfit = activeItems.fold<double>(
    0,
    (sum, item) => sum + ((item.expectedSalePrice ?? 0) - item.totalCost),
  );

  final watchlistHits = opportunities.where((item) => item.underMax).length;

  return DashboardKpiStripModel(
    liquidationPotential: liquidationPotential,
    expectedOpenProfit: expectedOpenProfit,
    watchlistHits: watchlistHits,
  );
});
