import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/app/providers/repositories_providers.dart';
import 'package:lego_trading_manager/features/dashboard/application/dashboard_quick_insight_model.dart';

final dashboardQuickInsightsProvider =
    Provider<List<DashboardQuickInsightModel>>((ref) {
  final inventory = ref.watch(inventoryRepositoryProvider).getAllItems();
  final sales = ref.watch(salesRepositoryProvider).getAllSales();

  final totalExpected = inventory.fold<double>(
    0,
    (sum, item) => sum + ((item.expectedSalePrice ?? 0) - item.totalCost),
  );

  final soldNet = sales.fold<double>(
    0,
    (sum, sale) => sum + sale.finalNet,
  );

  final avgDays = inventory.isEmpty
      ? 0
      : inventory.fold<double>(
            0,
            (sum, item) => sum + (item.daysInInventory ?? 0),
          ) /
          inventory.length;

  return [
    DashboardQuickInsightModel(
      title: 'Expected Inventory Profit',
      value: totalExpected.toStringAsFixed(0),
      subtitle: 'sum of active expected profit',
    ),
    DashboardQuickInsightModel(
      title: 'Realized Net',
      value: soldNet.toStringAsFixed(0),
      subtitle: 'net from completed sales',
    ),
    DashboardQuickInsightModel(
      title: 'Average Holding Days',
      value: avgDays.toStringAsFixed(1),
      subtitle: 'inventory aging speed',
    ),
  ];
});