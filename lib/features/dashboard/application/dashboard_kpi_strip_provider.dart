import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/app/providers/repositories_providers.dart';
import 'package:lego_trading_manager/features/dashboard/application/dashboard_kpi_strip_model.dart';
import 'package:lego_trading_manager/features/watchlist/application/watchlist_opportunities_provider.dart';

final dashboardKpiStripProvider = Provider<DashboardKpiStripModel>((ref) {
  final inventory = ref.watch(inventoryRepositoryProvider).getAllItems();
  final opportunities = ref.watch(watchlistOpportunitiesProvider);

  double liquidationPotential = 0;
  double expectedOpenProfit = 0;

  for (final item in inventory) {
    if (item.isActive) {
      liquidationPotential += (item.marketAverage ?? 0);
      expectedOpenProfit += ((item.expectedSalePrice ?? 0) - item.totalCost);
    }
  }

  final watchlistHits = opportunities.where((item) => item.underMax).length;

  return DashboardKpiStripModel(
    liquidationPotential: liquidationPotential,
    expectedOpenProfit: expectedOpenProfit,
    watchlistHits: watchlistHits,
  );
});