import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_metrics_summary_model.dart';
import 'package:lego_trading_manager/features/inventory/application/inventory_visible_items_provider.dart';

final inventoryMetricsSummaryProvider =
    Provider<InventoryMetricsSummaryModel>((ref) {
  final items = ref.watch(inventoryVisibleItemsProvider);

  final totalCost = items.fold<double>(0, (sum, item) => sum + item.totalCost);
  final expectedRevenue = items.fold<double>(
    0,
    (sum, item) => sum + (item.expectedSalePrice ?? 0),
  );
  final expectedProfit = expectedRevenue - totalCost;
  final trackedItems = items.where((e) => e.isTracked).length;

  return InventoryMetricsSummaryModel(
    totalItems: items.length,
    trackedItems: trackedItems,
    totalCost: totalCost,
    expectedRevenue: expectedRevenue,
    expectedProfit: expectedProfit,
  );
});